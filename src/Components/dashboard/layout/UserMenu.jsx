import React, { useState } from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Tooltip,
  Box,
  Chip,
} from "@mui/material";
import {
  AccountCircle,
  Logout as LogoutIcon,
  Person,
  AdminPanelSettings,
  LocalHospital,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../Firebase/firebase"; // Adjust path as needed

const UserMenu = ({
  user = {
    name: "Admin",
    initials: "AD",
    email: "admin@healthcare.com",
    role: "admin",
    userId: null, // Add userId to props
  }
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      handleClose();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const handleProfile = () => {
    handleClose();

    // Navigate based on user role
    if (user.role === "doctor") {
      // Navigate to doctor profile
      const doctorId = user.userId || auth.currentUser?.uid;
      navigate(`/profile/${doctorId}`);
    } else if (user.role === "patient") {
      // Navigate to patient profile
      const patientId = user.userId || auth.currentUser?.uid;
      navigate(`/patient-profile/${patientId}`);
    } else {
      // Default fallback
      navigate("/dashboared/admin-profile");
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case "admin":
        return "Administrator";
      case "doctor":
        return "Doctor";
      case "patient":
        return "Patient";
      default:
        return "User";
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case "admin":
        return <AdminPanelSettings sx={{ fontSize: 16 }} />;
      case "doctor":
        return <LocalHospital sx={{ fontSize: 16 }} />;
      case "patient":
        return <Person sx={{ fontSize: 16 }} />;
      default:
        return <Person sx={{ fontSize: 16 }} />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case "admin":
        return { bg: "#fce4ec", text: "#c2185b" };
      case "doctor":
        return { bg: "#e3f2fd", text: "#1976d2" };
      case "patient":
        return { bg: "#f3e5f5", text: "#7b1fa2" };
      default:
        return { bg: "#e0e0e0", text: "#616161" };
    }
  };

  const roleColors = getRoleColor();

  return (
    <>
      <Tooltip title="User Menu">
        <IconButton onClick={handleMenu} sx={{ ml: 1 }}>
          <Avatar
            alt={user.name}
            src={user.avatar}
            sx={{
              bgcolor: "#0c2993",
              width: 40,
              height: 40,
              fontWeight: "bold",
              color: "white",
              border: "2px solid #e3f2fd",
              transition: "all 0.3s",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 4px 12px rgba(12, 41, 147, 0.3)",
              },
            }}
          >
            {user.initials}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            minWidth: 280,
            mt: 1.5,
            overflow: "visible",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        {/* User Info Header */}
        <Box
          sx={{
            px: 2.5,
            py: 2.5,
            background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f7 100%)",
            borderBottom: "2px solid rgba(12, 41, 147, 0.08)",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <Avatar
              src={user.avatar}
              sx={{
                bgcolor: "#0c2993",
                width: 50,
                height: 50,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {user.initials}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0c2993", mb: 0.5 }}>
                {user.name}
              </Typography>
              <Chip
                icon={getRoleIcon()}
                label={getRoleLabel()}
                size="small"
                sx={{
                  bgcolor: roleColors.bg,
                  color: roleColors.text,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  height: 22,
                }}
              />
            </Box>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              fontWeight: 500,
              wordBreak: "break-word",
            }}
          >
            {user.email}
          </Typography>
        </Box>

        {/* Profile Option */}
        <MenuItem
          onClick={handleProfile}
          sx={{
            py: 1.5,
            px: 2.5,
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#f5f5f5",
              transform: "translateX(4px)",
            },
          }}
        >
          <Person sx={{ mr: 1.5, color: "#0c2993", fontSize: 22 }} />
          <Typography fontWeight={600}>View Profile</Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {/* Logout Option */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2.5,
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#ffebee",
              transform: "translateX(4px)",
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, color: "error.main", fontSize: 22 }} />
          <Typography color="error.main" fontWeight={700}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;