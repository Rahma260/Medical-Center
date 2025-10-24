import React from "react";
import { Snackbar, Alert } from "@mui/material";

const AlertSnackbar = ({ alert, onClose }) => {
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={alert.severity}
        sx={{
          width: "100%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
        onClose={onClose}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;