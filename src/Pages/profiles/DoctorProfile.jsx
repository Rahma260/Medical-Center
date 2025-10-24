import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Tabs,
  Tab,
  Grid,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  MedicalInformation,
  Schedule,
  CalendarMonth,
  Email,
  Phone,
  Warning,
  ArrowBack,
  Home,
} from "@mui/icons-material";

import ProfileLayout from "../../Components/profile/ProfileLayout";
import ProfileCard from "../../Components/profile/ProfileCard";
import ProfileDetail from "../../Components/profile/ProfileDetail";
import StatisticsGrid from "../../Components/profile/StatisticsGrid";
import AppointmentCard from "../../Components/profile/AppointmentCard";
import ScheduleSlotCard from "../../Components/profile/ScheduleSlotCard";

import { useProfile } from "../../hooks/useProfile";
import { useAppointments } from "../../hooks/useAppointments";
import { useSchedule } from "../../hooks/useSchedule";
import { useAlert } from "../../hooks/useAlert";

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [slot, setSlot] = useState({
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
    status: "available",
  });
  const [savingSlot, setSavingSlot] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    appointmentId: null,
    appointmentData: null,
  });

  // Custom hooks
  const { profile: doctor, loading: loadingDoctor } = useProfile("Doctors", doctorId);
  const { schedule, loading: loadingSchedule, addSlot: addScheduleSlot, deleteSlot, canDeleteSlot } = useSchedule(doctorId);
  const { appointments, loading: loadingAppointments, updateStatus, deleteAppointment, refetch: refetchAppointments } = useAppointments(doctorId, "doctorId");
  const { alert, showAlert, hideAlert } = useAlert();

  const getInitials = () => {
    if (!doctor) return "";
    return `${doctor.firstName?.[0] || ""}${doctor.lastName?.[0] || ""}`.toUpperCase();
  };

  const handleAddSlot = async () => {
    if (!slot.date || !slot.startTime || !slot.endTime) {
      showAlert("Please fill all required fields", "warning");
      return;
    }

    if (slot.endTime <= slot.startTime) {
      showAlert("End time must be after start time", "warning");
      return;
    }

    setSavingSlot(true);
    const result = await addScheduleSlot(slot);
    setSavingSlot(false);

    if (result.success) {
      showAlert("Schedule slot added successfully", "success");
      setSlot({ date: "", startTime: "", endTime: "", notes: "", status: "available" });
    } else {
      showAlert(`Error: ${result.error}`, "error");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    const result = await deleteSlot(slotId);
    if (result.success) {
      showAlert("Slot deleted successfully", "info");
    } else {
      showAlert("Failed to delete slot", "error");
    }
  };

  const handleCancelClick = (appointment) => {
    setConfirmDialog({
      open: true,
      appointmentId: appointment.id,
      appointmentData: appointment,
    });
  };

  const handleConfirmCancel = async () => {
    const { appointmentId, appointmentData } = confirmDialog;
    const result = await deleteAppointment(appointmentId, doctorId, appointmentData.slotId);

    if (result.success) {
      showAlert("Appointment cancelled and deleted successfully", "success");
      refetchAppointments();
    } else {
      showAlert("Failed to cancel appointment", "error");
    }

    setConfirmDialog({ open: false, appointmentId: null, appointmentData: null });
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    const result = await updateStatus(appointmentId, status);
    if (result.success) {
      showAlert(`Appointment ${status} successfully`, "success");
    } else {
      showAlert("Failed to update appointment status", "error");
    }
  };

  const isButtonDisabled = (appointment, action) => {
    const status = appointment.status?.toLowerCase();
    switch (action) {
      case "confirm":
        return status === "confirmed" || status === "completed";
      case "complete":
        return status === "completed";
      case "cancel":
        return status === "completed";
      default:
        return false;
    }
  };

  if (loadingDoctor) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Doctor not found. Please check the URL or try logging in again.</Alert>
      </Box>
    );
  }

  const stats = [
    { value: schedule.length, label: "Schedule Slots", bgcolor: "#f5f7ff", color: "#0c2993" },
    { value: appointments.length, label: "Appointments", bgcolor: "#fff5f8", color: "#ff66b2" },
  ];

  return (
    <Box>
      {/* Back to Home Button */}
      <Box
        sx={{
          position: "sticky",
          top: { xs: 64, md: 70 },
          zIndex: 100,
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(12, 41, 147, 0.08)",
          py: 1.5,
          px: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            borderColor: "#0c2993",
            color: "#0c2993",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              borderColor: "#0c2993",
              bgcolor: "rgba(12, 41, 147, 0.04)",
              transform: "translateX(-4px)",
            },
            transition: "all 0.3s",
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate("/")}
          sx={{
            background: "linear-gradient(90deg, #0c2993 0%, #1a58ff 100%)",
            color: "white",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(12, 41, 147, 0.2)",
            "&:hover": {
              background: "linear-gradient(90deg, #0a2380 0%, #154be0 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(12, 41, 147, 0.3)",
            },
            transition: "all 0.3s",
          }}
        >
          Home
        </Button>

        {/* Breadcrumb Style Navigation - Optional */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            ml: "auto",
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              cursor: "pointer",
              "&:hover": { color: "#0c2993", textDecoration: "underline" },
            }}
            onClick={() => navigate("/")}
          >
            Home
          </Typography>
          <Typography variant="caption" color="text.secondary">
            /
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              cursor: "pointer",
              "&:hover": { color: "#0c2993", textDecoration: "underline" },
            }}
            onClick={() => navigate("/doctors")}
          >
            Doctors
          </Typography>
          <Typography variant="caption" color="text.secondary">
            /
          </Typography>
          <Typography variant="caption" fontWeight={600} color="#0c2993">
            Dr. {doctor.firstName} {doctor.lastName}
          </Typography>
        </Box>
      </Box>

      <ProfileLayout icon={MedicalInformation} title="Doctor Profile">
        {/* Left: Profile Card */}
        <ProfileCard
          avatar={
            <Avatar
              src={doctor.photo || ""}
              sx={{
                width: 120,
                height: 120,
                bgcolor: doctor.photo ? "transparent" : "#0c2993",
                fontSize: 40,
              }}
            >
              {!doctor.photo && getInitials()}
            </Avatar>
          }
          title={`Dr. ${doctor.firstName} ${doctor.lastName}`}
          subtitle={doctor.department}
          badge={
            <>
              <Chip label={`License: ${doctor.medicalLicense || "N/A"}`} size="small" sx={{ width: "fit-content" }} />
              <Chip
                label={doctor.status || "Active"}
                size="small"
                color={doctor.status === "Active" ? "success" : "default"}
                sx={{ mt: 1 }}
              />
            </>
          }
          details={
            <>
              <ProfileDetail icon={Email} text={doctor.email} />
              <ProfileDetail icon={Phone} text={doctor.phone || "N/A"} />
              <Typography variant="body2" color="text.secondary">
                Institution: {doctor.institution || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Experience: {doctor.yearsOfExperience || "0"} years
              </Typography>
            </>
          }
          statistics={<StatisticsGrid stats={stats} />}
          footer={
            <Typography variant="body2" sx={{ textAlign: "center", fontSize: "0.875rem" }}>
              {doctor.bio || "No bio provided."}
            </Typography>
          }
        />

        {/* Right: Schedule & Appointments */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
              <Tab icon={<Schedule />} label="Manage Schedule" iconPosition="start" />
              <Tab icon={<CalendarMonth />} label={`Appointments (${appointments.length})`} iconPosition="start" />
            </Tabs>

            {/* Schedule Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" fontWeight={700} color="#0c2993" mb={2}>
                  Add New Slot
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Date"
                      type="date"
                      value={slot.date}
                      onChange={(e) => setSlot({ ...slot, date: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Start Time"
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => setSlot({ ...slot, startTime: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="End Time"
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => setSlot({ ...slot, endTime: e.target.value })}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Notes (optional)"
                      value={slot.notes}
                      onChange={(e) => setSlot({ ...slot, notes: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={handleAddSlot}
                        disabled={savingSlot}
                        sx={{ background: "linear-gradient(90deg,#0c2993,#ff66b2)" }}
                      >
                        {savingSlot ? "Saving..." : "Add Slot"}
                      </Button>
                      <Button
                        onClick={() => setSlot({ date: "", startTime: "", endTime: "", notes: "", status: "available" })}
                        disabled={savingSlot}
                      >
                        Reset
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={700} color="#0c2993" mb={2}>
                  Your Schedule ({schedule.length})
                </Typography>

                {loadingSchedule ? (
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : schedule.length === 0 ? (
                  <Alert severity="info">No schedule slots yet. Add your first availability above.</Alert>
                ) : (
                  <Grid container spacing={2}>
                    {schedule.map((s) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={s.id}>
                        <ScheduleSlotCard
                          slot={s}
                          onDelete={handleDeleteSlot}
                          canDelete={canDeleteSlot(s)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {/* Appointments Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={700} color="#0c2993" mb={2}>
                  Patient Appointments ({appointments.length})
                </Typography>

                {loadingAppointments ? (
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : appointments.length === 0 ? (
                  <Alert severity="info">No appointments yet. Patients can book appointments through your profile.</Alert>
                ) : (
                  <Stack spacing={2}>
                    {appointments.map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        showPatient
                        actions={
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              fullWidth
                              onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                              disabled={isButtonDisabled(apt, "confirm")}
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              fullWidth
                              onClick={() => handleUpdateStatus(apt.id, "completed")}
                              disabled={isButtonDisabled(apt, "complete")}
                            >
                              Complete
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              fullWidth
                              onClick={() => handleCancelClick(apt)}
                              disabled={isButtonDisabled(apt, "cancel")}
                            >
                              Cancel
                            </Button>
                          </>
                        }
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            )}
          </Paper>
        </Box>
      </ProfileLayout>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, appointmentId: null, appointmentData: null })}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="warning" />
          Confirm Cancellation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this appointment?
            {confirmDialog.appointmentData && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Patient:</strong> {confirmDialog.appointmentData.patientName}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {confirmDialog.appointmentData.date}
                </Typography>
              </Box>
            )}
            <Alert severity="warning" sx={{ mt: 2 }}>
              This action will <strong>permanently delete</strong> the appointment.
            </Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, appointmentId: null, appointmentData: null })} variant="outlined">
            Keep Appointment
          </Button>
          <Button onClick={handleConfirmCancel} variant="contained" color="error">
            Yes, Cancel & Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={5000} onClose={hideAlert} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={alert.severity} onClose={hideAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorProfile;