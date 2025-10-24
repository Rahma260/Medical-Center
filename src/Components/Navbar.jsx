import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import UserMenu from "./dashboard/layout/UserMenu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // ✅ FIXED: Monitor user authentication state and fetch role
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await fetchUserRole(currentUser.uid, currentUser.email);
      } else {
        setUserRole(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserRole = async (userId, userEmail) => {
    try {
      setLoading(true);
      console.log("Fetching role for user:", userId, userEmail);

      // ✅ NEW: First check Users collection for role intent
      const userProfileRef = doc(db, "Users", userId);
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        const profileData = userProfileSnap.data();
        console.log("✅ Found user profile:", profileData);

        // If role is "doctor" but no Doctors document yet (hasn't completed application)
        if (profileData.role === "doctor" && profileData.userType === "doctor") {
          console.log("✅ User is a Doctor (registered, pending application)");
          setUserRole("doctor");
          setUserData({
            name: profileData.firstName ? `${profileData.firstName} ${profileData.lastName || ""}`.trim() : auth.currentUser?.displayName || "User",
            initials: getInitials(profileData.firstName, profileData.lastName),
            email: profileData.email || userEmail,
            role: "doctor",
            avatar: profileData.photo || auth.currentUser?.photoURL || null,
            userId: userId,
            docId: userId,
          });
          setLoading(false);
          return;
        }
      }

      // ✅ Second try: Check if user exists in Doctors collection
      const doctorRef = doc(db, "Doctors", userId);
      const doctorSnap = await getDoc(doctorRef);

      if (doctorSnap.exists()) {
        const data = doctorSnap.data();
        console.log("✅ User is a Doctor (by ID)");
        setUserRole("doctor");
        setUserData({
          name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          initials: `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase(),
          email: data.email || userEmail,
          role: "doctor",
          avatar: data.photo || null,
          userId: userId,
          docId: userId,
        });
        setLoading(false);
        return;
      }

      // ✅ Third try: Query Doctors by email
      const doctorsRef = collection(db, "Doctors");
      const doctorQuery = query(doctorsRef, where("email", "==", userEmail));
      const doctorQuerySnap = await getDocs(doctorQuery);

      if (!doctorQuerySnap.empty) {
        const doctorDoc = doctorQuerySnap.docs[0];
        const data = doctorDoc.data();
        console.log("✅ User is a Doctor (by email)");
        setUserRole("doctor");
        setUserData({
          name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          initials: `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase(),
          email: data.email || userEmail,
          role: "doctor",
          avatar: data.photo || null,
          userId: userId,
          docId: doctorDoc.id,
        });
        setLoading(false);
        return;
      }

      // ✅ Fourth try: Check Patient by ID
      const patientRef = doc(db, "Patients", userId);
      const patientSnap = await getDoc(patientRef);

      if (patientSnap.exists()) {
        const data = patientSnap.data();
        console.log("✅ User is a Patient (by ID)");
        setUserRole("patient");
        setUserData({
          name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          initials: `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase(),
          email: data.email || userEmail,
          role: "patient",
          avatar: data.photo || null,
          userId: userId,
          docId: userId,
        });
        setLoading(false);
        return;
      }

      // ✅ Fifth try: Query Patients by email
      const patientsRef = collection(db, "Patients");
      const patientQuery = query(patientsRef, where("email", "==", userEmail));
      const patientQuerySnap = await getDocs(patientQuery);

      if (!patientQuerySnap.empty) {
        const patientDoc = patientQuerySnap.docs[0];
        const data = patientDoc.data();
        console.log("✅ User is a Patient (by email)");
        setUserRole("patient");
        setUserData({
          name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
          initials: `${data.firstName?.[0] || ""}${data.lastName?.[0] || ""}`.toUpperCase(),
          email: data.email || userEmail,
          role: "patient",
          avatar: data.photo || null,
          userId: userId,
          docId: patientDoc.id,
        });
        setLoading(false);
        return;
      }

      // ✅ Default: If no role found, default to patient
      console.log("⚠️ User role not found, defaulting to patient");
      setUserRole("patient");
      setUserData({
        name: auth.currentUser?.displayName || "User",
        initials: getUserInitials(),
        email: userEmail,
        role: "patient",
        avatar: auth.currentUser?.photoURL || null,
        userId: userId,
        docId: userId,
      });
    } catch (error) {
      console.error("❌ Error fetching user role:", error);
      setUserRole("patient");
      setUserData({
        name: auth.currentUser?.displayName || "User",
        initials: getUserInitials(),
        email: userEmail,
        role: "patient",
        avatar: auth.currentUser?.photoURL || null,
        userId: userId,
        docId: userId,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper to get initials
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
  };

  // Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setUserRole(null);
    setUserData(null);
    navigate("/");
  };

  // ✅ Navigate to profile based on role
  const navigateToProfile = () => {
    if (!user || !userRole) return;

    if (userRole === "doctor") {
      navigate(`/profile/${userData?.docId || user.uid}`);
    } else if (userRole === "patient") {
      navigate(`/patient-profile/${userData?.docId || user.uid}`);
    }

    setMobileOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.displayName) return user?.email?.[0]?.toUpperCase() || "U";
    const names = user.displayName.split(" ");
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  };

  // Get role label
  const getRoleLabel = () => {
    if (!userRole) return "";
    return userRole === "doctor" ? "Doctor" : "Patient";
  };

  // Drawer Content (Mobile)
  const drawer = (
    <Box
      sx={{
        width: 300,
        height: "100%",
        background: "linear-gradient(180deg, #ffffff 0%, #f5f8fc 100%)",
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2.5,
          background: "linear-gradient(135deg, #0c2993 0%, #1a58ff 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/logo.png"
            alt="Medical Center Logo"
            style={{
              width: 50,
              height: 40,
              marginRight: 12,
              filter: "brightness(0) invert(1)",
            }}
          />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Health Care
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Info (if logged in) */}
      {user && userData && (
        <Box
          sx={{
            m: 2,
            p: 2.5,
            background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f7 100%)",
            borderRadius: 3,
            border: "1px solid rgba(12, 41, 147, 0.08)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: "#0c2993",
                width: 50,
                height: 50,
                mr: 2,
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(12, 41, 147, 0.15)",
              }}
              src={userData.avatar}
            >
              {userData.initials}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#0c2993",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userData.name || "User"}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userData.email}
              </Typography>
            </Box>
          </Box>
          {userRole && (
            <Chip
              label={getRoleLabel()}
              size="small"
              sx={{
                bgcolor: userRole === "doctor" ? "#e3f2fd" : "#f3e5f5",
                color: userRole === "doctor" ? "#1976d2" : "#7b1fa2",
                fontWeight: 700,
                fontSize: "0.75rem",
                px: 1,
              }}
            />
          )}
        </Box>
      )}

      <Divider sx={{ mx: 2, my: 1 }} />

      {/* Profile Link (Mobile Only - if logged in) */}
      {user && !loading && (
        <Box sx={{ px: 2, mt: 2 }}>
          <ListItem
            onClick={navigateToProfile}
            sx={{
              borderRadius: 2,
              background: "linear-gradient(135deg, #f5f8fc 0%, #e8edf5 100%)",
              border: "1px solid rgba(12, 41, 147, 0.1)",
              "&:hover": {
                background: "linear-gradient(135deg, #e8edf5 0%, #dce4f0 100%)",
                transform: "translateX(4px)",
                transition: "all 0.2s",
              },
              cursor: "pointer",
              mb: 1,
            }}
          >
            <ListItemIcon>
              <PersonIcon sx={{ color: "#0c2993" }} />
            </ListItemIcon>
            <ListItemText
              primary="My Profile"
              primaryTypographyProps={{
                fontWeight: 600,
                color: "#0c2993",
              }}
            />
          </ListItem>
        </Box>
      )}

      {/* Login / Logout Button */}
      <Box sx={{ px: 2, mt: "auto", pb: 3 }}>
        {!user ? (
          <Button
            variant="contained"
            fullWidth
            startIcon={<LoginIcon />}
            onClick={() => {
              navigate("/login");
              setMobileOpen(false);
            }}
            sx={{
              mt: 3,
              textTransform: "none",
              fontWeight: 700,
              py: 1.5,
              borderRadius: 2,
              background: "linear-gradient(90deg, #0c2993 0%, #1a58ff 100%)",
              boxShadow: "0 4px 12px rgba(26, 88, 255, 0.25)",
              "&:hover": {
                background: "linear-gradient(90deg, #0a2380 0%, #154be0 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(26, 88, 255, 0.35)",
              },
            }}
          >
            Login
          </Button>
        ) : (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              mt: 3,
              textTransform: "none",
              fontWeight: 700,
              py: 1.5,
              borderRadius: 2,
              color: "#d32f2f",
              borderColor: "#d32f2f",
              "&:hover": {
                bgcolor: "#ffebee",
                borderColor: "#c62828",
                transform: "translateY(-2px)",
              },
            }}
          >
            Logout
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(12px)",
          color: "#0c2993",
          boxShadow: "0 2px 20px rgba(12, 41, 147, 0.08)",
          borderBottom: "1px solid rgba(12, 41, 147, 0.08)",
          left: 0,
          right: 0,
          width: "100%",
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 1,
            px: { xs: 1, sm: 2, md: 3 },
            minHeight: { xs: 56, sm: 64 },
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Logo Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.02)" },
              gap: { xs: 0.75, sm: 1, md: 1.5 },
              minWidth: 0,
              flex: 1,
            }}
            onClick={() => navigate("/")}
          >
            <Box
              component="img"
              src="/images/logo.png"
              alt="Medical Center Logo"
              sx={{
                width: { xs: 40, sm: 50, md: 55 },
                height: { xs: 30, sm: 38, md: 42 },
                flexShrink: 0,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#0c2993",
                letterSpacing: 0.5,
                fontSize: { xs: "1.3rem", sm: "1.3rem", md: "1.6rem" },
                background: "linear-gradient(135deg, #0c2993 0%, #1a58ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.2,
              }}
            >
              Health Care
            </Typography>
          </Box>

          {/* Right Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, sm: 1, md: 2 },
              flexShrink: 0,
            }}
          >
            {!user ? (
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  background: "linear-gradient(90deg, #0c2993 0%, #1a58ff 100%)",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 0.75, sm: 1 },
                  fontSize: { xs: "0.8rem", sm: "0.875rem", md: "1rem" },
                  boxShadow: "0 4px 12px rgba(26, 88, 255, 0.25)",
                  display: { xs: "none", sm: "inline-flex" },
                  "&:hover": {
                    background: "linear-gradient(90deg, #0a2380 0%, #154be0 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(26, 88, 255, 0.35)",
                  },
                }}
                startIcon={<LoginIcon />}
              >
                Login
              </Button>
            ) : (
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                {userData && !loading && <UserMenu user={userData} />}
              </Box>
            )}

            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                display: { md: "none" },
                border: "2px solid #0c2993",
                borderRadius: 1.5,
                p: { xs: 0.75, sm: 1 },
                "&:hover": {
                  bgcolor: "#f5f8fc",
                },
              }}
            >
              <MenuIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          disableScrollLock: true,
        }}
        PaperProps={{
          sx: {
            boxShadow: "-4px 0 20px rgba(12, 41, 147, 0.1)",
            width: { xs: "85%", sm: 300 },
            maxWidth: 300,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar />
    </>
  );
};

export default Navbar;