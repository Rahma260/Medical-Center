import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

const TopBar = ({
  drawerWidth,
  onDrawerToggle,
  currentPageTitle,
  notifications,
  user,
  onLogout,
}) => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${drawerWidth}px` },
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="primary"
            onClick={onDrawerToggle}
            sx={{ display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600} color="#0c2993">
            {currentPageTitle}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <NotificationBell notifications={notifications} />
          <UserMenu user={user} onLogout={onLogout} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;