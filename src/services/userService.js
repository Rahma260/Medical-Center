import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase/firebase";

export const userService = {
  // ✅ NEW: Create user profile in Users collection for role tracking
  createUserProfile: async (userId, formData) => {
    try {
      const nameParts = (formData.fullName || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await setDoc(doc(db, "Users", userId), {
        userId: userId,
        email: (formData.email || "").trim().toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        fullName: formData.fullName || "",
        phone: formData.phone || "",
        address: formData.address || "",
        gender: formData.gender || "",
        userType: formData.role, // "patient" or "doctor"
        role: formData.role, // "patient" or "doctor"
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("✅ User profile created in Users collection");
      return { success: true };
    } catch (error) {
      console.error("❌ Error creating user profile:", error);
      return { success: false, error: error.message };
    }
  },

  // Create patient
  createPatient: async (userId, formData) => {
    try {
      const nameParts = (formData.fullName || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await setDoc(doc(db, "Patients", userId), {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        name: (formData.fullName || "").trim(),
        email: (formData.email || "").trim().toLowerCase(),
        gender: formData.gender || "",
        phone: formData.phone || "",
        address: formData.address || "",
        role: "patient",
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Patient created successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Error creating patient:", error);
      return { success: false, error: error.message };
    }
  },

  // Create doctor application
  // Create doctor application
  createDoctorApplication: async (userId, formData) => {
    try {
      const nameParts = (formData.fullName || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // ✅ Use 'doctorApplications' (lowercase) to match your structure
      await setDoc(doc(db, "doctorApplications", userId), {
        uid: userId,
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: (formData.email || "").trim().toLowerCase(),
        gender: formData.gender || "",
        phone: formData.phone || "",
        address: formData.address || "",
        department: "",
        yearsOfExperience: "",
        institution: "",
        medicalLicense: "",
        bio: "",
        photo: "",
        role: "doctor",
        applicationStatus: "Pending Review",
        status: "Pending Review",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Doctor application created successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Error creating doctor application:", error);
      return { success: false, error: error.message };
    }
  },
};