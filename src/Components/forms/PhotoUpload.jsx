import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const PhotoUpload = ({
  currentPhoto,
  onChange,
  error,
  label = "Profile Photo",
  size = 100
}) => {
  return (
    <Box>
      <Typography sx={{ mb: 1 }}>
        {currentPhoto ? "Update" : "Upload"} {label}
      </Typography>
      {currentPhoto && (
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <Avatar
            src={currentPhoto}
            alt="Current profile"
            sx={{
              width: size,
              height: size,
              border: "3px solid #e3f2fd"
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          border: "2px dashed #dce3f5",
          borderRadius: 2,
          p: 2,
          textAlign: "center",
          cursor: "pointer",
          "&:hover": {
            bgcolor: "#f8faff",
            borderColor: "#0c2993ff"
          }
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          style={{ display: "none" }}
          id="photo-upload"
        />
        <label htmlFor="photo-upload" style={{ cursor: "pointer" }}>
          <PhotoCamera sx={{ fontSize: 40, color: "#0c2993ff", mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Click to upload or drag and drop
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PNG, JPG, GIF up to 5MB
          </Typography>
        </label>
      </Box>
      {error && (
        <Typography color="error" fontSize={13} sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default PhotoUpload;