import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const AuthLayout = ({
  title,
  subtitle,
  children,
  imageUrl = "/images/login.png"
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f9f9ff",
      }}
    >
      {/* Left Side - Form */}
      <Box
        component={motion.div}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
          px: 2,
          background: "linear-gradient(135deg, #e8efff, #ffffff)",
          overflowY: "auto",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#0c2993ff", mb: 1 }}
          >
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: "gray" }}>
            {subtitle}
          </Typography>
          {children}
        </Box>
      </Box>

      {/* Right Side - Image */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderTopLeftRadius: "50px",
          borderBottomLeftRadius: "50px",
          boxShadow: "-10px 0 20px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      />
    </Box>
  );
};

export default AuthLayout;