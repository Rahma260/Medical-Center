import React, { useEffect } from "react";
import { Box, TextField, Button, Alert, CircularProgress, IconButton, Grid, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormSection from "../../Components/forms/FormSection";
import DoctorInfoCard from "../../Components/forms/DoctorInfoCard";
import { useAppointmentForm } from "../../hooks/useAppointmentForm";

const ACCENT_BLUE = "#0c2993";

export default function AppointmentForm({
  doctorId,
  doctorName,
  department,
  doctorPhoto,
  initialDate,
  initialTime,
  slotId,
  onClose,
  onSuccess,
}) {
  const {
    formData,
    loading,
    error,
    success,
    handleChange,
    submitAppointment,
  } = useAppointmentForm({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    reason: "",
    date: initialDate || "",
    time: initialTime || "",
    doctorId,
    doctorName,
    department,
  });

  useEffect(() => {
    if (success && onSuccess) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [success, onSuccess, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitAppointment(doctorId, slotId);
    if (result.success && onSuccess) {
      onSuccess(result);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: ACCENT_BLUE }}>
          Book Appointment
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Doctor Info */}
      <DoctorInfoCard
        doctorName={doctorName}
        department={department}
        date={initialDate}
        time={initialTime}
        photo={doctorPhoto}
      />

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Appointment booked successfully! The slot has been reserved.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <FormSection>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Patient Name"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="patientPhone"
                value={formData.patientPhone}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reason for Visit"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Appointment Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Appointment Time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Grid>
          </Grid>
        </FormSection>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || success}
            sx={{
              backgroundColor: ACCENT_BLUE,
              "&:hover": { backgroundColor: "#081f73" },
              py: 1.5,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Confirm Booking"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={onClose}
            disabled={loading}
            sx={{
              borderColor: ACCENT_BLUE,
              color: ACCENT_BLUE,
              "&:hover": { borderColor: "#081f73", backgroundColor: "transparent" },
              py: 1.5,
            }}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
}