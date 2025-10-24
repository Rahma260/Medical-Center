import { useState, useEffect } from "react";
import { profileService } from "../services/profileService";

export const useAppointments = (userId, filterKey = "doctorId") => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await profileService.fetchAppointments(userId, filterKey);

    if (result.success) {
      setAppointments(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId, filterKey]);

  const updateStatus = async (appointmentId, status) => {
    const result = await profileService.updateAppointmentStatus(appointmentId, status);
    if (result.success) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
      );
    }
    return result;
  };

  const deleteAppointment = async (appointmentId, doctorId, slotId) => {
    const result = await profileService.deleteAppointment(appointmentId, doctorId, slotId);
    if (result.success) {
      setAppointments((prev) => prev.filter((apt) => apt.id !== appointmentId));
    }
    return result;
  };

  return {
    appointments,
    loading,
    error,
    updateStatus,
    deleteAppointment,
    refetch: fetchAppointments,
  };
};