import React from "react";
import { Box, Typography } from "@mui/material";

const DashboardHeader = ({ title, subtitle, color = "#1A237E" }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" fontWeight={700} sx={{ color, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </Box>
  );
};

export default DashboardHeader;