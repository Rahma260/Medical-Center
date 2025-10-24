import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../Firebase/firebase";

export const authService = {
  // Register new user
  register: async (formData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: "Invalid email or password" };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check user role
  getUserRole: async (userId, email) => {
    try {
      // Check Admin
      const adminDoc = await getDoc(doc(db, "Admins", userId));
      if (adminDoc.exists()) {
        return { role: "admin", data: adminDoc.data(), id: userId };
      }

      // Check Doctor by UID
      let doctorSnap = await getDoc(doc(db, "Doctors", userId));

      // If not found by UID, search by email
      if (!doctorSnap.exists()) {
        const q = query(collection(db, "Doctors"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          doctorSnap = querySnapshot.docs[0];
        }
      }

      if (doctorSnap && doctorSnap.exists()) {
        const doctorData = doctorSnap.data();
        const isApproved =
          doctorData.approvedBy ||
          doctorData.approved === true ||
          doctorData.status === "Active";

        return {
          role: "doctor",
          data: doctorData,
          id: doctorSnap.id,
          isApproved
        };
      }

      // Check Patient
      const patientDoc = await getDoc(doc(db, "Patients", userId));
      if (patientDoc.exists()) {
        return { role: "patient", data: patientDoc.data(), id: userId };
      }

      return { role: null };
    } catch (error) {
      console.error("Error getting user role:", error);
      return { role: null, error: error.message };
    }
  },
};