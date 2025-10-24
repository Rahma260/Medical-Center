import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { signOut } from "firebase/auth";
import { auth } from "../../../Firebase/firebase";

const Sidebar = ({ navigationItems, logo, title, subtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear any local storage or session data if needed
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #0c2993 0%, #0f3fb3 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
          <Avatar src={logo} sx={{ bgcolor: "white", color: "#0c2993" }}>
            H
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {subtitle}
            </Typography>
          </Box>
        </Box>

        <List>
          {navigationItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  my: 0.5,
                  transition: "all 0.3s",
                  color: selected ? "#0c2993" : "white",
                  backgroundColor: selected ? "white" : "transparent",
                  "&:hover": {
                    backgroundColor: selected ? "white" : "rgba(255,255,255,0.1)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: selected ? "#0c2993" : "white",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ pt: 2 }}>
        {/* Logout Button */}
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: "white",
            borderColor: "rgba(255,255,255,0.3)",
            borderRadius: 2,
            py: 1,
            mb: 2,
            textTransform: "none",
            fontWeight: 600,
            transition: "all 0.3s",
            "&:hover": {
              borderColor: "white",
              backgroundColor: "rgba(255,255,255,0.1)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Logout
        </Button>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />
        <Typography variant="caption" sx={{ opacity: 0.7, display: "block", textAlign: "center" }}>
          © 2025 Health Care
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;