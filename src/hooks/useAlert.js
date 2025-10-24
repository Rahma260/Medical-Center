import { useState } from "react";

export const useAlert = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity = "info") => {
    setAlert({ open: true, message, severity });
  };

  const hideAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return { alert, showAlert, hideAlert };
};