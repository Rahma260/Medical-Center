import React from "react";
import { Box, Alert, Button } from "@mui/material";

const ErrorState = ({ error, onRetry, bgcolor = "#F7F8FC" }) => {
  return (
    <Box sx={{ p: 3, bgcolor, minHeight: "100vh" }}>
      <Alert severity="error">{error}</Alert>
      <Button
        variant="contained"
        onClick={onRetry}
        sx={{ mt: 2, bgcolor: "#1A237E" }}
      >
        Retry
      </Button>
    </Box>
  );
};

export default ErrorState;