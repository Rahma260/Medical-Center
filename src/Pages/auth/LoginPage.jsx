import React, { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../Components/auth/AuthLayout";
import FormField from "../../Components/auth/FormField";
import PasswordField from "../../Components/auth/PasswordField";
import AuthButton from "../../Components/auth/AuthButton";
import AuthLink from "../../Components/auth/AuthLink";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
  };

  return (
    <AuthLayout
      title="Welcome Back 👋"
      subtitle="Log in to access your account"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <PasswordField
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 1 }}
        />

        {/* Forgot Password Link */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#0c2993",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </Typography>
        </Box>

        <AuthButton isLoading={isLoading} loadingText="Logging in...">
          Login
        </AuthButton>
      </Box>

      <AuthLink
        question="Don't have an account?"
        linkText="Register"
        to="/register"
      />
    </AuthLayout>
  );
}