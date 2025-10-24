import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../Firebase/firebase";

export const doctorApplicationService = {
  // Check if email exists in Doctors or doctorApplications
  checkEmailExists: async (email, currentUserId = null) => {
    try {
      const doctorsRef = collection(db, "Doctors");
      const doctorsQuery = query(doctorsRef, where("email", "==", email));
      const doctorsSnapshot = await getDocs(doctorsQuery);

      // If email exists in Doctors and it's not the current user
      if (!doctorsSnapshot.empty) {
        const existingDoctor = doctorsSnapshot.docs[0];
        if (!currentUserId || existingDoctor.id !== currentUserId) {
          return {
            exists: true,
            location: "Doctors",
            message: "This email is already registered as a doctor."
          };
        }
      }

      // Check in doctorApplications collection
      const applicationsRef = collection(db, "doctorApplications");
      const applicationsQuery = query(applicationsRef, where("email", "==", email));
      const applicationsSnapshot = await getDocs(applicationsQuery);

      // If email exists in applications and it's not the current user
      if (!applicationsSnapshot.empty) {
        const existingApplication = applicationsSnapshot.docs[0];
        if (!currentUserId || existingApplication.id !== currentUserId) {
          return {
            exists: true,
            location: "doctorApplications",
            message: "An application with this email already exists."
          };
        }
      }

      return { exists: false, message: "Email is available" };
    } catch (error) {
      console.error("Error checking email existence:", error);
      return {
        exists: false,
        error: error.message,
        message: "Could not verify email uniqueness"
      };
    }
  },

  // Fetch existing application
  fetchApplication: async (userId) => {
    try {
      const appDoc = await getDoc(doc(db, "doctorApplications", userId));

      if (appDoc.exists()) {
        return {
          success: true,
          data: { id: appDoc.id, ...appDoc.data() }
        };
      }

      return { success: true, data: null };
    } catch (error) {
      console.error("Error fetching application:", error);
      return { success: false, error: error.message };
    }
  },

  // Upload photo to Cloudinary
  uploadPhoto: async (photoFile) => {
    try {
      const formData = new FormData();
      formData.append("file", photoFile);
      formData.append("upload_preset", "btd7amx6");
      formData.append("folder", "doctorPhotos");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/drswql658/image/upload",
        { method: "POST", body: formData }
      );

      const data = await res.json();
      return { success: true, url: data.secure_url };
    } catch (error) {
      console.error("Error uploading photo:", error);
      return { success: false, error: error.message };
    }
  },

  // Submit or update application
  submitApplication: async (userId, applicationData, isUpdate = false) => {
    try {
      // Check email uniqueness before submitting
      const emailCheck = await doctorApplicationService.checkEmailExists(
        applicationData.email,
        userId
      );

      if (emailCheck.exists) {
        return {
          success: false,
          error: emailCheck.message
        };
      }

      const docData = {
        ...applicationData,
        consultationPrice: parseFloat(applicationData.consultationPrice),
        uid: userId,
        applicationStatus: applicationData.applicationStatus || "pending",
        updatedAt: serverTimestamp(),
      };

      if (isUpdate) {
        await updateDoc(doc(db, "doctorApplications", userId), docData);
      } else {
        await setDoc(doc(db, "doctorApplications", userId), {
          ...docData,
          createdAt: serverTimestamp(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error submitting application:", error);
      return { success: false, error: error.message };
    }
  }
};