import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Avatar,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  AdminPanelSettings,
  Email,
  Edit,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  Lock,
} from "@mui/icons-material";

import ProfileLayout from "../../Components/profile/ProfileLayout";
import ProfileCard from "../../Components/profile/ProfileCard";
import ProfileDetail from "../../Components/profile/ProfileDetail";
import StatisticsGrid from "../../Components/profile/StatisticsGrid";

import { auth, db } from "../../Firebase/firebase";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
  });

  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [changingPassword, setChangingPassword] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchAdminData();
    fetchStats();
  }, []);

  const fetchAdminData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        showAlert("No user logged in", "error");
        setLoading(false);
        return;
      }

      // Admin data is stored in Users collection or can be hardcoded
      const adminData = {
        email: user.email,
        firstName: "Admin",
        lastName: "User",
        phone: "N/A",
        role: "admin",
        createdAt: user.metadata.creationTime,
      };

      // Try to fetch from Firestore if admin profile exists
      try {
        const adminDoc = await getDoc(doc(db, "Admins", user.uid));
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setAdmin({ ...adminData, ...data, id: user.uid });
          setEditForm({
            firstName: data.firstName || "Admin",
            lastName: data.lastName || "User",
            phone: data.phone || "",
          });
        } else {
          setAdmin({ ...adminData, id: user.uid });
          setEditForm({
            firstName: "Admin",
            lastName: "User",
            phone: "",
          });
        }
      } catch (error) {
        console.log("Admin doc doesn't exist, using default");
        setAdmin({ ...adminData, id: user.uid });
        setEditForm({
          firstName: "Admin",
          lastName: "User",
          phone: "",
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      showAlert("Failed to load admin profile", "error");
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch doctors
      const doctorsSnapshot = await getDocs(collection(db, "Doctors"));
      const totalDoctors = doctorsSnapshot.size;

      // Fetch patients
      const patientsSnapshot = await getDocs(collection(db, "Patients"));
      const totalPatients = patientsSnapshot.size;

      // Fetch appointments
      const appointmentsSnapshot = await getDocs(collection(db, "Appointments"));
      const appointments = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const totalAppointments = appointments.length;
      const pendingAppointments = appointments.filter(apt =>
        apt.status?.toLowerCase() === "pending"
      ).length;

      setStats({
        totalDoctors,
        totalPatients,
        totalAppointments,
        pendingAppointments,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditForm({
      firstName: admin?.firstName || "Admin",
      lastName: admin?.lastName || "User",
      phone: admin?.phone || "",
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const user = auth.currentUser;

      if (!user) {
        showAlert("No user logged in", "error");
        setSaving(false);
        return;
      }

      // Save to Firestore
      await updateDoc(doc(db, "Admins", user.uid), {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
        updatedAt: new Date().toISOString(),
      });

      setAdmin({
        ...admin,
        ...editForm,
      });

      setEditing(false);
      showAlert("Profile updated successfully", "success");
      setSaving(false);
    } catch (error) {
      console.error("Error updating profile:", error);

      // If document doesn't exist, create it
      if (error.code === "not-found") {
        try {
          const user = auth.currentUser;
          await updateDoc(doc(db, "Admins", user.uid), {
            email: user.email,
            firstName: editForm.firstName,
            lastName: editForm.lastName,
            phone: editForm.phone,
            role: "admin",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });

          setAdmin({
            ...admin,
            ...editForm,
          });

          setEditing(false);
          showAlert("Profile created successfully", "success");
        } catch (createError) {
          console.error("Error creating profile:", createError);
          showAlert("Failed to create profile", "error");
        }
      } else {
        showAlert("Failed to update profile", "error");
      }
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert("New passwords do not match", "error");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showAlert("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setChangingPassword(true);
      const user = auth.currentUser;

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordForm.currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, passwordForm.newPassword);

      showAlert("Password changed successfully", "success");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangingPassword(false);
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.code === "auth/wrong-password") {
        showAlert("Current password is incorrect", "error");
      } else {
        showAlert("Failed to change password", "error");
      }
      setChangingPassword(false);
    }
  };

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const hideAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const getInitials = () => {
    if (!admin) return "AD";
    return `${admin.firstName?.[0] || "A"}${admin.lastName?.[0] || "D"}`.toUpperCase();
  };

  const statisticsData = [
    {
      value: stats.totalDoctors,
      label: "Doctors",
      bgcolor: "#e3f2fd",
      color: "#1976d2",
    },
    {
      value: stats.totalPatients,
      label: "Patients",
      bgcolor: "#f3e5f5",
      color: "#7b1fa2",
    },
    {
      value: stats.totalAppointments,
      label: "Appointments",
      bgcolor: "#fff3e0",
      color: "#f57c00",
    },
    {
      value: stats.pendingAppointments,
      label: "Pending",
      bgcolor: "#ffebee",
      color: "#c62828",
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!admin) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Admin profile not found.</Alert>
      </Box>
    );
  }

  return (
    <ProfileLayout icon={AdminPanelSettings} title="Admin Profile" iconColor="#c2185b">
      {/* Left: Profile Card */}
      <ProfileCard
        avatar={
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "#c2185b",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {getInitials()}
          </Avatar>
        }
        title={`${admin.firstName} ${admin.lastName}`}
        subtitle="System Administrator"
        badge={
          <Chip
            icon={<AdminPanelSettings />}
            label="Administrator"
            size="small"
            sx={{
              bgcolor: "#fce4ec",
              color: "#c2185b",
              fontWeight: 700,
            }}
          />
        }
        details={
          <>
            <ProfileDetail icon={Email} text={admin.email} />
            {admin.phone && admin.phone !== "N/A" && (
              <ProfileDetail icon={Lock} text={admin.phone} />
            )}
            {admin.createdAt && (
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                Member since: {new Date(admin.createdAt).toLocaleDateString()}
              </Typography>
            )}
          </>
        }
        statistics={<StatisticsGrid stats={statisticsData} />}
      />

      {/* Right: Edit Profile & Change Password */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: { xs: "100%", md: "auto" },
        }}
      >
        <Stack spacing={3}>
          {/* Edit Profile Section */}
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700} color="#0c2993">
                Profile Information
              </Typography>
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{
                    borderColor: "#c2185b",
                    color: "#c2185b",
                    "&:hover": {
                      borderColor: "#c2185b",
                      bgcolor: "#fce4ec",
                    },
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{
                      background: "linear-gradient(90deg, #c2185b 0%, #f06292 100%)",
                      "&:hover": {
                        background: "linear-gradient(90deg, #ad1457 0%, #e91e63 100%)",
                      },
                    }}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </Stack>
              )}
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  fullWidth
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  disabled={!editing}
                  variant={editing ? "outlined" : "filled"}
                  placeholder="Enter phone number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  value={admin.email}
                  disabled
                  variant="filled"
                  helperText="Email cannot be changed"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Change Password Section */}
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Typography variant="h6" fontWeight={700} color="#0c2993" mb={3}>
              Change Password
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Current Password"
                  type={showPasswords.current ? "text" : "password"}
                  fullWidth
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                          }
                          edge="end"
                        >
                          {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  type={showPasswords.new ? "text" : "password"}
                  fullWidth
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                          }
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm New Password"
                  type={showPasswords.confirm ? "text" : "password"}
                  fullWidth
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                          }
                          edge="end"
                        >
                          {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleChangePassword}
                  disabled={
                    changingPassword ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword
                  }
                  sx={{
                    background: "linear-gradient(90deg, #0c2993 0%, #1a58ff 100%)",
                    py: 1.5,
                    "&:hover": {
                      background: "linear-gradient(90deg, #0a2380 0%, #154be0 100%)",
                    },
                  }}
                >
                  {changingPassword ? <CircularProgress size={24} color="inherit" /> : "Change Password"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={alert.severity} onClose={hideAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </ProfileLayout>
  );
};

export default AdminProfile;