import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Firebase/firebase";

export const profileService = {
  // Fetch user profile (doctor or patient)
  fetchProfile: async (collection, userId) => {
    try {
      const docRef = doc(db, collection, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      }
      return { success: false, error: "Profile not found" };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { success: false, error: error.message };
    }
  },

  // Fetch appointments
  fetchAppointments: async (userId, filterKey = "doctorId") => {
    try {
      const appointmentsRef = collection(db, "Appointments");
      const querySnapshot = await getDocs(appointmentsRef);

      const appointments = [];
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        if (data[filterKey] === userId || (filterKey === "patientId" && data.bookedBy === userId)) {
          appointments.push({
            id: docSnapshot.id,
            ...data,
          });
        }
      });

      // Sort by date
      appointments.sort((a, b) => {
        const dateCompare = (b.date || "").localeCompare(a.date || "");
        if (dateCompare === 0) {
          return (b.time || b.startTime || "").localeCompare(a.time || a.startTime || "");
        }
        return dateCompare;
      });

      return { success: true, data: appointments };
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return { success: false, error: error.message };
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const appointmentRef = doc(db, "Appointments", appointmentId);
      await updateDoc(appointmentRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      console.error("Error updating appointment:", error);
      return { success: false, error: error.message };
    }
  },

  // Delete appointment
  deleteAppointment: async (appointmentId, doctorId, slotId) => {
    try {
      // Delete appointment
      await deleteDoc(doc(db, "Appointments", appointmentId));

      // Release slot if exists
      if (doctorId && slotId) {
        const slotRef = doc(db, "Doctors", doctorId, "Schedule", slotId);
        await updateDoc(slotRef, {
          status: "available",
          bookedBy: null,
          bookedAt: null,
          appointmentId: null,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return { success: false, error: error.message };
    }
  },
};