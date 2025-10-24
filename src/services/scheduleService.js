import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";

export const scheduleService = {
  // Fetch doctor's schedule
  fetchSchedule: async (doctorId) => {
    try {
      const schedRef = collection(db, "Doctors", doctorId, "Schedule");
      const querySnapshot = await getDocs(schedRef);

      const schedule = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const slotDate = new Date(data.date);
        if (slotDate >= today) {
          schedule.push({ id: doc.id, ...data });
        }
      });

      // Sort by date and time
      schedule.sort((a, b) => {
        const dateCompare = (a.date || "").localeCompare(b.date || "");
        if (dateCompare === 0) {
          return (a.startTime || "").localeCompare(b.startTime || "");
        }
        return dateCompare;
      });

      return { success: true, data: schedule };
    } catch (error) {
      console.error("Error fetching schedule:", error);
      return { success: false, error: error.message };
    }
  },

  // Add schedule slot
  addSlot: async (doctorId, slotData) => {
    try {
      const schedRef = collection(db, "Doctors", doctorId, "Schedule");
      const newSlot = {
        ...slotData,
        status: slotData.status || "available",
        createdAt: new Date(),
        doctorId,
      };

      await addDoc(schedRef, newSlot);
      return { success: true };
    } catch (error) {
      console.error("Error adding slot:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete schedule slot
  deleteSlot: async (doctorId, slotId) => {
    try {
      await deleteDoc(doc(db, "Doctors", doctorId, "Schedule", slotId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting slot:", error);
      return { success: false, error: error.message };
    }
  },

  // Check if slot can be deleted
  canDeleteSlot: (slot) => {
    return slot.status?.toLowerCase() !== "booked";
  },
};