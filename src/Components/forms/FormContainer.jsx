import React from "react";
import { Box, Paper, Typography, Divider, Backdrop, CircularProgress } from "@mui/material";

const FormContainer = ({
  title,
  subtitle,
  logo,
  statusBanner,
  loading,
  children,
  maxWidth = 900
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #abb3d0ff, #e185bbff)",
        py: 8,
        px: 2,
      }}
    >
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ maxWidth, mx: "auto" }}>
        <Paper
          elevation={8}
          sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: "#fff" }}
        >
          <Box textAlign="center" mb={3}>
            {logo && (
              <img
                src={logo}
                alt="Logo"
                style={{ width: 80, height: 60, marginBottom: 8 }}
              />
            )}
            <Typography variant="h4" fontWeight={800} color="#0c2993ff">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {statusBanner}
          </Box>

          <Divider sx={{ my: 3 }} />

          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default FormContainer;