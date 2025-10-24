import React, { useState } from "react";
import { Box, Alert } from "@mui/material";
import {
  Email,
  Person,
  Phone,
  Home,
  Badge,
  Wc,
} from "@mui/icons-material";
import AuthLayout from "../../Components/auth/AuthLayout";
import FormField from "../../Components/auth/FormField";
import PasswordField from "../../Components/auth/PasswordField";
import SelectField from "../../Components/auth/SelectField";
import AuthButton from "../../Components/auth/AuthButton";
import AuthLink from "../../Components/auth/AuthLink";
import { useAuth } from "../../hooks/useAuth";

const GENDERS = ["Male", "Female"];
const ROLES = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
    address: "",
    role: "patient",
  });
  const { register, isLoading, error } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join Health care and start your healthy journey"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
        <FormField
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          icon={<Person color="primary" />}
          sx={{ mb: 2 }}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          icon={<Email color="primary" />}
          sx={{ mb: 2 }}
        />

        <PasswordField
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <FormField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          icon={<Phone color="primary" />}
          sx={{ mb: 2 }}
        />

        <FormField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          icon={<Home color="primary" />}
          sx={{ mb: 2 }}
        />

        <SelectField
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={GENDERS}
          icon={<Wc color="primary" />}
          sx={{ mb: 2 }}
        />

        <SelectField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={ROLES}
          icon={<Badge color="primary" />}
          helperText="Choose Patient or Doctor"
          sx={{ mb: 3 }}
        />

        <AuthButton isLoading={isLoading} loadingText="Registering...">
          Register
        </AuthButton>
      </Box>

      <AuthLink
        question="Already have an account?"
        linkText="Login here"
        to="/login"
      />
    </AuthLayout>
  );
}