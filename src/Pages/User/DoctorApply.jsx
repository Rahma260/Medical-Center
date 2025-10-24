import React, { useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment
} from "@mui/material";
import {
  Person as PersonIcon,
  LocalHospital as LocalHospitalIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import FormContainer from "../../Components/forms/FormContainer";
import FormSection from "../../Components/forms/FormSection";
import PhotoUpload from "../../Components/forms/PhotoUpload";
import PriceField from "../../Components/forms/PriceField";
import { useDoctorApplication } from "../../hooks/useDoctorApplication";
import { useFirestore } from "../../hooks/useFirestore";
import { useAlert } from "../../hooks/useAlert";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  yearsOfExperience: "",
  medicalLicense: "",
  institution: "",
  bio: "",
  photo: "",
  consultationPrice: "",
};

const DoctorApplicationForm = () => {
  const navigate = useNavigate();
  const { data: departments } = useFirestore("Departments");
  const { alert, showAlert, hideAlert } = useAlert();

  const {
    currentUser,
    existingApplication,
    form,
    errors,
    loading,
    checkingEmail, // ✅ NEW
    handleChange,
    handleEmailBlur, // ✅ NEW
    handlePhotoChange,
    submitApplication,
  } = useDoctorApplication(initialFormState);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/login");
    }
  }, [loading, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await submitApplication();

    if (result.success) {
      showAlert(
        existingApplication
          ? "Application updated successfully!"
          : "Application submitted successfully! We'll review it within 48 hours.",
        "success"
      );
    } else {
      showAlert(
        result.error || "Failed to submit application. Please try again.",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormContainer
      title="Doctor Application Form"
      subtitle={
        existingApplication
          ? "Update your application details below."
          : "Join our medical network and share your expertise with patients."
      }
      logo="/images/logo.png"
      statusBanner={
        existingApplication && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f0f8ff", borderRadius: 2 }}>
            <Typography variant="body2" color="info.main">
              Status: {existingApplication.applicationStatus || "pending"}
            </Typography>
          </Box>
        )
      }
      loading={loading}
    >
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <FormSection icon={PersonIcon} title="Personal Information">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                value={form.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                value={form.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={form.email}
                onChange={handleChange}
                onBlur={handleEmailBlur} // ✅ NEW: Check email on blur
                error={!!errors.email}
                helperText={errors.email}
                disabled={!!existingApplication} // ✅ Disable if updating
                InputProps={{
                  endAdornment: checkingEmail && (
                    <InputAdornment position="end">
                      <CircularProgress size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <PhotoUpload
                currentPhoto={form.photo}
                onChange={handlePhotoChange}
                error={errors.photo}
              />
            </Grid>
          </Grid>
        </FormSection>

        {/* Professional Information */}
        <FormSection icon={LocalHospitalIcon} title="Professional Information">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Department"
                name="department"
                fullWidth
                value={form.department}
                onChange={handleChange}
                error={!!errors.department}
                helperText={errors.department}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Years of Experience"
                name="yearsOfExperience"
                fullWidth
                type="number"
                value={form.yearsOfExperience}
                onChange={handleChange}
                error={!!errors.yearsOfExperience}
                helperText={errors.yearsOfExperience}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Medical License Number"
                name="medicalLicense"
                fullWidth
                value={form.medicalLicense}
                onChange={handleChange}
                error={!!errors.medicalLicense}
                helperText={errors.medicalLicense}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Current Institution"
                name="institution"
                fullWidth
                value={form.institution}
                onChange={handleChange}
                error={!!errors.institution}
                helperText={errors.institution}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PriceField
                value={form.consultationPrice}
                onChange={handleChange}
                error={!!errors.consultationPrice}
                helperText={errors.consultationPrice}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Professional Bio"
                name="bio"
                fullWidth
                multiline
                rows={4}
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about your experience and specialties..."
              />
            </Grid>
          </Grid>
        </FormSection>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || checkingEmail}
          sx={{
            mt: 1,
            py: 1.3,
            bgcolor: "#0c2993ff",
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            "&:hover": { bgcolor: "#082c7d" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : existingApplication ? (
            "Update Application"
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={hideAlert}
          severity={alert.severity}
          icon={
            alert.severity === "success" ? (
              <CheckCircleIcon fontSize="inherit" />
            ) : (
              <ErrorIcon fontSize="inherit" />
            )
          }
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </FormContainer>
  );
};

export default DoctorApplicationForm;