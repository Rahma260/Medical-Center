import React, { useState } from "react";
import { Box, Drawer, useTheme, useMediaQuery } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  MedicalServices as MedicalServicesIcon,
  Person as PersonIcon
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";

const drawerWidth = 270;

const navigationItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboared" },
  { text: "Doctor Applications", icon: <PeopleIcon />, path: "doctor-applications" },
  { text: "Patients", icon: <PeopleIcon />, path: "patients" },
  { text: "Appointments", icon: <ScheduleIcon />, path: "appointments" },
  { text: "Doctors", icon: <MedicalServicesIcon />, path: "doctors" },
  { text: "Profile", icon: <PersonIcon />, path: "admin-profile" },
];

const mockNotifications = [
  { id: 1, message: "New appointment scheduled", time: "2 min ago", type: "info" },
  { id: 2, message: "Patient checked in", time: "10 min ago", type: "success" },
];

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => navigate("/login");

  const currentPageTitle =
    navigationItems.find((item) => item.path === location.pathname)?.text || "Dashboard";

  const sidebarContent = (
    <Sidebar
      navigationItems={navigationItems}
      logo="/images/logo.jpg"
      title="Health Care"
      subtitle="Admin Dashboard"
    />
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8faff" }}>
      <TopBar
        drawerWidth={drawerWidth}
        onDrawerToggle={handleDrawerToggle}
        currentPageTitle={currentPageTitle}
        notifications={mockNotifications}
        user={{ name: "Admin", initials: "RK" }}
        onLogout={handleLogout}
      />

      <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth, border: "none" },
          }}
        >
          {sidebarContent}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: "none",
              boxShadow: "4px 0 20px rgba(0,0,0,0.05)",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, md: 4 },
          mt: { xs: 8, lg: 9 },
          backgroundColor: "#f8faff",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;