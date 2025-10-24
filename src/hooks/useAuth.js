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
      setError("An unexpected error occurred.");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setError("");
    setIsLoading(true);

    try {
      const registerResult = await authService.register(formData);

      if (!registerResult.success) {
        setError(registerResult.error);
        return { success: false };
      }

      const user = registerResult.user;

      // Create user document based on role
      let result;
      if (formData.role === "patient") {
        result = await userService.createPatient(user.uid, formData);
      } else if (formData.role === "doctor") {
        result = await userService.createDoctorApplication(user.uid, formData);
      }

      if (result.success) {
        navigate("/");
        return { success: true };
      } else {
        setError(result.error);
        return { success: false };
      }
    } catch (err) {
      setError(err.message || "Registration failed");
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