export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateDoctorApplication = (form, photoFile, existingPhoto) => {
  const errors = {};

  if (!form.firstName.trim()) errors.firstName = "First name is required";
  if (!form.lastName.trim()) errors.lastName = "Last name is required";

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(form.email)) {
    errors.email = "Invalid email format";
  }

  if (!form.phone.trim()) errors.phone = "Phone number is required";
  if (!form.department) errors.department = "Department is required";

  if (!form.yearsOfExperience) {
    errors.yearsOfExperience = "Years of experience is required";
  } else if (form.yearsOfExperience < 0 || form.yearsOfExperience > 70) {
    errors.yearsOfExperience = "Enter a valid experience (0–70 years)";
  }

  if (!form.medicalLicense.trim()) {
    errors.medicalLicense = "Medical license is required";
  }

  if (!form.institution.trim()) {
    errors.institution = "Institution name is required";
  }

  if (!form.consultationPrice) {
    errors.consultationPrice = "Consultation price is required";
  } else if (form.consultationPrice < 0) {
    errors.consultationPrice = "Price must be positive";
  } else if (form.consultationPrice > 10000) {
    errors.consultationPrice = "Price seems too high";
  }

  if (!form.photo && !photoFile && !existingPhoto) {
    errors.photo = "Profile photo is required";
  }

  return errors;
};

export const validateAppointmentForm = (formData) => {
  const errors = {};

  if (!formData.patientName.trim()) {
    errors.patientName = "Patient name is required";
  }

  if (!formData.patientEmail.trim()) {
    errors.patientEmail = "Email is required";
  } else if (!validateEmail(formData.patientEmail)) {
    errors.patientEmail = "Invalid email format";
  }

  if (!formData.patientPhone.trim()) {
    errors.patientPhone = "Phone number is required";
  }

  if (!formData.reason.trim()) {
    errors.reason = "Reason for visit is required";
  }

  if (!formData.date) {
    errors.date = "Date is required";
  }

  if (!formData.time) {
    errors.time = "Time is required";
  }

  return errors;
};