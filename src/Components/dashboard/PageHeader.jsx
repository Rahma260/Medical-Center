import React from "react";
import { Box, Typography, Button } from "@mui/material";

const PageHeader = ({ title, icon: Icon, actionButton }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          color: "#0c2993",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {Icon && <Icon sx={{ fontSize: 36, color: "#ff66b2" }} />}
        {title}
      </Typography>
      {actionButton}
    </Box>
  );
};

export default PageHeader;