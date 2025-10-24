import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { userService } from "../services/userService";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
    setError("");
    setIsLoading(true);

    try {
      const loginResult = await authService.login(email, password);

      if (!loginResult.success) {
        setError(loginResult.error);
        return { success: false };
      }

      const user = loginResult.user;
      const roleResult = await authService.getUserRole(user.uid, user.email);

      if (!roleResult.role) {
        setError("User role not found. Please contact support.");
        return { success: false };
      }

      // Route based on role
      switch (roleResult.role) {
        case "admin":
          navigate("/dashboared");
          break;
        case "doctor":
          if (roleResult.isApproved) {
            navigate(`/profile/${roleResult.id}`);
          } else {
            setError("Your account is pending admin approval.");
            return { success: false };
          }
          break;
        case "patient":
          navigate("/");
          break;
        default:
          setError("Invalid user role.");
          return { success: false };
      }

      return { success: true };
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "An unexpected error occurred.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setError("");
    setIsLoading(true);

    try {
      // ✅ Step 1: Create auth user
      const registerResult = await authService.register(formData);

      if (!registerResult.success) {
        setError(registerResult.error);
        return { success: false };
      }

      const user = registerResult.user;
      console.log("✅ Auth user created:", user.uid);

      // ✅ Step 2: Create Users document (NEW)
      const usersResult = await userService.createUserProfile(user.uid, formData);
      if (!usersResult.success) {
        console.warn("⚠️ User profile creation failed:", usersResult.error);
        // Don't fail here - continue anyway
      }

      // ✅ Step 3: Create patient or doctor document
      let result;
      if (formData.role === "patient") {
        console.log("📝 Creating patient document...");
        result = await userService.createPatient(user.uid, formData);
      } else if (formData.role === "doctor") {
        console.log("📝 Creating doctor application...");
        result = await userService.createDoctorApplication(user.uid, formData);
      }

      if (!result.success) {
        setError(result.error);
        return { success: false };
      }

      console.log("✅ User document created successfully");

      // ✅ Step 4: Navigate based on role
      if (formData.role === "doctor") {
        navigate("/doctor-application");
      } else {
        navigate("/");
      }

      return { success: true };
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const result = await authService.logout();
    if (result.success) {
      navigate("/login");
    }
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    setError,
  };
};