import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../Firebase/firebase";

export const appointmentService = {
  // Create appointment
  createAppointment: async (appointmentData) => {
    try {
      const userId = auth.currentUser?.uid || null;

      const fullAppointmentData = {
        ...appointmentData,
        patientId: userId,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const appointmentRef = await addDoc(
        collection(db, "Appointments"),
        fullAppointmentData
      );

      return { success: true, id: appointmentRef.id };
    } catch (error) {
      console.error("Error creating appointment:", error);
      return { success: false, error: error.message };
    }
  },

  // Update slot status
  updateSlotStatus: async (doctorId, slotId, status, appointmentId = null) => {
    try {
      const slotRef = doc(db, "Doctors", doctorId, "Schedule", slotId);
      const userId = auth.currentUser?.uid || null;

      await updateDoc(slotRef, {
        status,
        bookedBy: status === "booked" ? userId : null,
        bookedAt: status === "booked" ? new Date().toISOString() : null,
        appointmentId: status === "booked" ? appointmentId : null,
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating slot:", error);
      return { success: false, error: error.message };
    }
  },

  // Book appointment (combines both operations)
  bookAppointment: async (doctorId, slotId, appointmentData) => {
    try {
      // Create appointment
      const appointmentResult = await appointmentService.createAppointment(appointmentData);

      if (!appointmentResult.success) {
        return appointmentResult;
      }

      // Update slot status
      const slotResult = await appointmentService.updateSlotStatus(
        doctorId,
        slotId,
        "booked",
        appointmentResult.id
      );

      if (!slotResult.success) {
        // TODO: Consider rollback logic here
        return slotResult;
      }

      return {
        success: true,
        appointmentId: appointmentResult.id,
        patientId: auth.currentUser?.uid || null
      };
    } catch (error) {
      console.error("Error booking appointment:", error);
      return { success: false, error: error.message };
    }
  }

};