import React from "react";
import { Card, CardContent, Typography, Box, Avatar } from "@mui/material";

const StatCard = ({ title, value, icon, color, loading = false }) => (
  <Card
    sx={{
      p: 3,
      borderRadius: 3,
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      bgcolor: "white",
      borderLeft: `5px solid ${color}`,
      transition: "0.3s",
      height: "100%",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
      },
    }}
  >
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h3" fontWeight={700} color={color}>
          {loading ? "..." : value}
        </Typography>
      </Box>
      <Avatar
        sx={{
          bgcolor: `${color}15`,
          color: color,
          width: 60,
          height: 60,
        }}
      >
        {icon}
      </Avatar>
    </Box>
  </Card>
);

export default StatCard;