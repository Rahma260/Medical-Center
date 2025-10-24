import { useState, useEffect } from "react";
import { scheduleService } from "../services/scheduleService";

export const useSchedule = (doctorId) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSchedule = async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await scheduleService.fetchSchedule(doctorId);

    if (result.success) {
      setSchedule(result.data);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSchedule();
  }, [doctorId]);

  const addSlot = async (slotData) => {
    const result = await scheduleService.addSlot(doctorId, slotData);
    if (result.success) {
      await fetchSchedule();
    }
    return result;
  };

  const deleteSlot = async (slotId) => {
    const result = await scheduleService.deleteSlot(doctorId, slotId);
    if (result.success) {
      setSchedule((prev) => prev.filter((s) => s.id !== slotId));
    }
    return result;
  };

  return {
    schedule,
    loading,
    error,
    addSlot,
    deleteSlot,
    canDeleteSlot: scheduleService.canDeleteSlot,
    refetch: fetchSchedule,
  };
};