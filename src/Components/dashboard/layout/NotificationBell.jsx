import React, { useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";

const NotificationBell = ({ notifications = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleClick} color="primary" sx={{ backgroundColor: "#f5f6fa" }}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, borderRadius: 2, boxShadow: 5, p: 1 },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <MenuItem key={n.id} sx={{ py: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor:
                      n.type === "success"
                        ? "success.main"
                        : n.type === "info"
                          ? "info.main"
                          : "warning.main",
                  }}
                />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {n.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {n.time}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;