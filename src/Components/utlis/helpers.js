// Format currency
export const formatPrice = (price) => {
  if (!price) return "N/A";
  return `$${parseFloat(price).toFixed(2)}`;
};

// Get initials from name
export const getInitials = (firstName, lastName) => {
  if (!firstName && !lastName) return "?";
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

// Get initials from full name
export const getInitialsFromFullName = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Format date
export const formatDate = (date) => {
  if (!date) return "N/A";
  if (date.toDate) return date.toDate().toLocaleDateString();
  return new Date(date).toLocaleDateString();
};

// Status color mapping
export const getAppointmentStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
    case "scheduled":
      return { bg: "#fde4f0", color: "#ff66b2" };
    case "completed":
      return { bg: "#e3f2fd", color: "#0c2993" };
    case "pending":
      return { bg: "#fff3e0", color: "#ff9800" };
    case "cancelled":
      return { bg: "#f5f5f5", color: "#c45c5cff" };
    default:
      return { bg: "#e0e0e0", color: "#616161" };
  }
};

export const getDoctorStatusColor = (status) => {
  return {
    bg: status === "Active" ? "#e3f2fd" : "#fff3e0",
    color: status === "Active" ? "#0c2993" : "#ff9800",
  };
};

export const getGenderColor = (gender) => {
  return {
    bg: gender === "female" ? "#fde4f0" : "#e3f2fd",
    color: gender === "female" ? "#ff66b2" : "#0c2993",
  };
};