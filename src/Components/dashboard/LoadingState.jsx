import React from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingState = ({ bgcolor = "#F7F8FC" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor,
      }}
    >
      <CircularProgress size={60} sx={{ color: "#1A237E" }} />
    </Box>
  );
};

export default LoadingState;