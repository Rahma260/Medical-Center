import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Stack,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  AccountCircle,
  Email,
  Phone,
  AttachMoney,
  Wc,
} from "@mui/icons-material";

const GENDERS = ["Male", "Female"];

const DoctorDialog = ({
  open,
  doctor,
  departments,
  onClose,
  onSubmit,
  imageUpload,
  showAlert,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    department: "",
    yearsOfExperience: "",
    institution: "",
    medicalLicense: "",
    bio: "",
    photo: "",
    consultationPrice: "",
    status: "Active",
    approvedBy: "Admin",
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        firstName: doctor.firstName || "",
        lastName: doctor.lastName || "",
        email: doctor.email || "",
        phone: doctor.phone || "",
        gender: doctor.gender || "",
        department: doctor.department || "",
        yearsOfExperience: doctor.yearsOfExperience || "",
        institution: doctor.institution || "",
        medicalLicense: doctor.medicalLicense || "",
        bio: doctor.bio || "",
        photo: doctor.photo || "",
        consultationPrice: doctor.consultationPrice || "",
        status: doctor.status || "Active",
        approvedBy: doctor.approvedBy || "Admin",
      });
      imageUpload.setImagePreview(doctor.photo || "");
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        department: "",
        yearsOfExperience: "",
        institution: "",
        medicalLicense: "",
        bio: "",
        photo: "",
        consultationPrice: "",
        status: "Active",
        approvedBy: "Admin",
      });
      imageUpload.resetImage();
    }
  }, [doctor, open]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          color: "#0c2993",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {doctor ? "Edit Doctor" : "Add New Doctor"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Image Upload Section */}
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={imageUpload.imagePreview || formData.photo}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "#0c2993",
                  fontSize: 36,
                }}
              >
                {!imageUpload.imagePreview &&
                  !formData.photo &&
                  getInitials(formData.firstName, formData.lastName)}
              </Avatar>
              <Box>
                <Button
                  variant="contained"
                  component="label"
                  size="small"
                  disabled={imageUpload.isUploading}
                >
                  {imageUpload.imagePreview ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      imageUpload.handleImageChange(e, (msg, severity) =>
                        showAlert(msg, severity)
                      )
                    }
                  />
                </Button>
                {imageUpload.isUploading && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <CircularProgress size={20} />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      Uploading...
                    </Typography>
                  </Box>
                )}
              </Box>
              {imageUpload.imagePreview && (
                <Button
                  color="error"
                  size="small"
                  onClick={() => imageUpload.resetImage()}
                  disabled={imageUpload.isUploading}
                >
                  Remove
                </Button>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              {imageUpload.imagePreview && !imageUpload.isUploading
                ? "Image ready to upload"
                : "Max size: 5MB, JPG/PNG format"}
            </Typography>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="action" />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />
          </Grid>

          {/* Gender Field */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                label="Gender"
                name="gender"
                onChange={handleInputChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Wc color="action" />
                  </InputAdornment>
                }
              >
                {GENDERS.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Professional Information */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                label="Department"
                name="department"
                onChange={handleInputChange}
              >
                {departments.map((dept, idx) => (
                  <MenuItem key={idx} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Years of Experience"
              name="yearsOfExperience"
              type="number"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              InputProps={{
                inputProps: { min: 0, max: 50 },
              }}
              margin="normal"
            />
          </Grid>

          {/* Consultation Price */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Consultation Price"
              name="consultationPrice"
              type="number"
              value={formData.consultationPrice}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney color="action" />
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: "0.01" },
              }}
              margin="normal"
              placeholder="50.00"
            />
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Institution"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Medical License"
              name="medicalLicense"
              value={formData.medicalLicense}
              onChange={handleInputChange}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                name="status"
                onChange={handleInputChange}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Bio */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Professional Bio"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleInputChange}
              margin="normal"
              placeholder="Write a brief professional biography..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: "#ff66b2",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "rgba(255, 102, 178, 0.08)",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(90deg,#0c2993,#ff66b2)",
            fontWeight: 700,
            px: 3,
            "&:hover": {
              opacity: 0.9,
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(12, 41, 147, 0.3)",
            },
            transition: "all 0.3s",
          }}
          onClick={handleSubmit}
          disabled={imageUpload.isUploading}
        >
          {imageUpload.isUploading ? (
            <>
              <CircularProgress
                size={24}
                sx={{
                  color: "white",
                  mr: 1,
                }}
              />
              {doctor ? "Updating..." : "Adding..."}
            </>
          ) : doctor ? (
            "Update Doctor"
          ) : (
            "Add Doctor"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorDialog;