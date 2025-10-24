import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebase";

export const userService = {
  // Create patient
  createPatient: async (userId, formData) => {
    try {
      await setDoc(doc(db, "Patients", userId), {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        role: "patient",
        status: "active",
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create doctor application
  createDoctorApplication: async (userId, formData) => {
    try {
      const [firstName, ...rest] = formData.fullName.trim().split(" ");
      const lastName = rest.join(" ");

      await setDoc(doc(db, "doctorApplications", userId), {
        uid: userId,
        firstName: firstName || "",
        lastName: lastName || "",
        email: formData.email.trim().toLowerCase(),
        gender: formData.gender,
        phone: formData.phone,
        address: formData.address,
        department: "",
        yearsOfExperience: "",
        institution: "",
        medicalLicense: "",
        bio: "",
        photo: "",
        role: "doctor",
        status: "Pending Review",
        createdAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};