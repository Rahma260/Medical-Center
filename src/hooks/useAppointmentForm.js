import { useState } from "react";
import { appointmentService } from "../services/appointmentService";
import { validateAppointmentForm } from "../Components/utlis/formValidation";

export const useAppointmentForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const submitAppointment = async (doctorId, slotId) => {
    const validationErrors = validateAppointmentForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      return { success: false };
    }

    setLoading(true);
    setError("");

    try {
      const result = await appointmentService.bookAppointment(
        doctorId,
        slotId,
        formData
      );

      if (result.success) {
        setSuccess(true);
        return result;
      } else {
        setError(result.error || "Failed to book appointment");
        return result;
      }
    } catch (err) {
      setError("Failed to book appointment. Please try again.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    submitAppointment,
    setError,
  };
};