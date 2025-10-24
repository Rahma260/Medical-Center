import React, { useState } from "react";
import { Box, Alert, Typography } from "@mui/material";
import { Email, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../Components/auth/AuthLayout";
import FormField from "../../Components/auth/FormField";
import AuthButton from "../../Components/auth/AuthButton";
import AuthLink from "../../Components/auth/AuthLink";
import { auth } from "../../Firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + "/login", // Redirect URL after password reset
        handleCodeInApp: false,
      });

      setSuccess(true);
      setEmail("");

      // Auto redirect to login after 5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      console.error("Password reset error:", error);

      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email address");
          break;
        case "auth/invalid-email":
          setError("Invalid email address format");
          break;
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later");
          break;
        default:
          setError("Failed to send password reset email. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError("");
    setSuccess(false);
  };

  return (
    <AuthLayout
      title="Forgot Password? 🔐"
      subtitle="Enter your email to receive a password reset link"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Password reset email sent successfully! ✅
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Please check your inbox and follow the instructions to reset your password.
            You'll be redirected to login page in 5 seconds...
          </Typography>
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={handleChange}
          icon={<Email color="primary" />}
          placeholder="Enter your registered email"
          disabled={success}
          sx={{ mb: 3 }}
        />

        <AuthButton
          isLoading={isLoading}
          loadingText="Sending reset link..."
          disabled={success}
        >
          Send Reset Link
        </AuthButton>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center", mt: 2 }}>
        <AuthLink
          question="Remember your password?"
          linkText="Back to Login"
          to="/login"
          icon={<ArrowBack sx={{ fontSize: 16 }} />}
        />

        <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", mt: 1 }}>
          Don't have an account?{" "}
          <Typography
            component="span"
            variant="caption"
            sx={{
              color: "#0c2993",
              fontWeight: 700,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => navigate("/register")}
          >
            Register here
          </Typography>
        </Typography>
      </Box>
    </AuthLayout>
  );
}