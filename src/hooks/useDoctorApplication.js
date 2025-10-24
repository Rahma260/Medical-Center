import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { doctorApplicationService } from "../services/doctorApplicationService";
import { validateDoctorApplication } from "../Components/utlis/formValidation";

export const useDoctorApplication = (initialForm) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [existingApplication, setExistingApplication] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkingEmail, setCheckingEmail] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const result = await doctorApplicationService.fetchApplication(user.uid);

        if (result.success && result.data) {
          setExistingApplication(result.data);
          setForm({
            ...initialForm,
            ...result.data,
            email: result.data.email || user.email || "",
          });
        } else {
          setForm(prev => ({ ...prev, email: user.email || "" }));
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleEmailBlur = async () => {
    if (!form.email || form.email === existingApplication?.email) {
      return;
    }

    setCheckingEmail(true);
    const emailCheck = await doctorApplicationService.checkEmailExists(
      form.email,
      currentUser?.uid
    );
    setCheckingEmail(false);

    if (emailCheck.exists) {
      setErrors({
        ...errors,
        email: emailCheck.message
      });
    } else {
      // Clear email error if it was previously set
      if (errors.email) {
        const { email, ...rest } = errors;
        setErrors(rest);
      }
    }
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
    if (errors.photo) {
      setErrors({ ...errors, photo: "" });
    }
  };

  const validateForm = async () => {
    // First, validate form fields
    const newErrors = validateDoctorApplication(
      form,
      photoFile,
      existingApplication?.photo
    );

    // Check email uniqueness if email has changed
    if (form.email && form.email !== existingApplication?.email) {
      const emailCheck = await doctorApplicationService.checkEmailExists(
        form.email,
        currentUser?.uid
      );

      if (emailCheck.exists) {
        newErrors.email = emailCheck.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitApplication = async () => {
    const isValid = await validateForm();

    if (!isValid) {
      return { success: false, error: "Please fix the errors before submitting." };
    }

    if (!currentUser) {
      return { success: false, error: "You must be logged in to submit an application." };
    }

    setLoading(true);

    try {
      let photoURL = form.photo;

      if (photoFile) {
        const uploadResult = await doctorApplicationService.uploadPhoto(photoFile);
        if (!uploadResult.success) {
          setLoading(false);
          return { success: false, error: "Failed to upload photo" };
        }
        photoURL = uploadResult.url;
      }

      const result = await doctorApplicationService.submitApplication(
        currentUser.uid,
        { ...form, photo: photoURL },
        !!existingApplication
      );

      if (result.success) {
        setExistingApplication({ id: currentUser.uid, ...form, photo: photoURL });
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    existingApplication,
    form,
    photoFile,
    errors,
    loading,
    checkingEmail,
    setLoading,
    handleChange,
    handleEmailBlur,
    handlePhotoChange,
    submitApplication,
  };
};