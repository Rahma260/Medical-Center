import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Paper,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  PhotoCamera,
  Close,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";

const PhotoUpload = ({
  currentPhoto,
  onChange,
  error,
  label = "Profile Photo",
  size = 100,
  maxSize = 5, // MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = maxSize * 1024 * 1024; // Convert to bytes

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file) => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      return "Please upload an image file";
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than ${maxSize}MB`;
    }

    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      onChange({
        target: {
          name: "photo",
          value: "",
          error: validationError,
        },
      });
      return;
    }

    setFileName(file.name);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 200);

    // Read file as data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        onChange({
          target: {
            name: "photo",
            value: reader.result,
            files: { 0: file },
          },
        });
        setUploadProgress(100);
      }, 500);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setFileName("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange({
      target: {
        name: "photo",
        value: "",
      },
    });
  };

  const getFileSizeDisplay = (file) => {
    if (!file) return "";
    const bytes = file.size;
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <Box>
      <Typography
        sx={{
          mb: 2,
          fontWeight: 600,
          color: "#0c2993",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PhotoCamera sx={{ fontSize: "1.2rem" }} />
        {currentPhoto ? "Update" : "Upload"} {label}
      </Typography>

      {currentPhoto && (
        <Paper
          elevation={3}
          sx={{
            mb: 3,
            p: 2.5,
            bgcolor: "linear-gradient(135deg, #f5f8fc 0%, #eef2f7 100%)",
            border: "2px solid #0c2993",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Photo Preview */}
          <Avatar
            src={currentPhoto}
            alt="Current profile"
            sx={{
              width: size,
              height: size,
              border: "3px solid #0c2993",
              boxShadow: "0 4px 12px rgba(12, 41, 147, 0.2)",
            }}
          />

          {/* File Info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontWeight: 600,
                color: "#0c2993",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CheckCircle sx={{ fontSize: "1rem", color: "#2e7d32" }} />
              Photo Uploaded
            </Typography>
            {fileName && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                {fileName}
              </Typography>
            )}
          </Box>

          {/* Remove Button */}
          <IconButton
            onClick={handleRemovePhoto}
            sx={{
              bgcolor: "#ff6b6b",
              color: "white",
              "&:hover": {
                bgcolor: "#ee5a52",
              },
            }}
          >
            <Close />
          </IconButton>
        </Paper>
      )}

      {/* Upload Area */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClickUpload}
        sx={{
          border: "2px dashed",
          borderColor: isDragging ? "#0c2993" : "#dce3f5",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          bgcolor: isDragging ? "#f0f8ff" : "transparent",
          "&:hover": {
            bgcolor: "#f8faff",
            borderColor: "#0c2993",
            boxShadow: "0 4px 12px rgba(12, 41, 147, 0.1)",
          },
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          id="photo-upload"
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <CloudUpload
            sx={{
              fontSize: 48,
              color: isDragging ? "#0c2993" : "#0c2993",
              transition: "all 0.2s",
              transform: isDragging ? "scale(1.2)" : "scale(1)",
            }}
          />

          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#0c2993",
            }}
          >
            {isDragging
              ? "Drop your image here"
              : "Click to upload or drag and drop"}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            PNG, JPG, GIF up to {maxSize}MB
          </Typography>

          <Button
            variant="outlined"
            size="small"
            sx={{
              mt: 1,
              color: "#0c2993",
              borderColor: "#0c2993",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#0c2993",
                bgcolor: "#f0f8ff",
              },
            }}
          >
            Browse Files
          </Button>
        </Box>
      </Box>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Uploading...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {Math.round(uploadProgress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: "#e3f2fd",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#0c2993",
              },
            }}
          />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: "#ffebee",
            border: "1px solid #ffcdd2",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography color="error" fontSize={13} sx={{ fontWeight: 600 }}>
            ✕ {error}
          </Typography>
        </Box>
      )}

      {/* File Info */}
      {fileName && uploadProgress === 100 && (
        <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={fileName}
            size="small"
            variant="outlined"
            sx={{ color: "#0c2993", borderColor: "#0c2993" }}
          />
          <Chip
            label="✓ Ready"
            size="small"
            sx={{
              bgcolor: "#e8f5e9",
              color: "#2e7d32",
              fontWeight: 600,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PhotoUpload;