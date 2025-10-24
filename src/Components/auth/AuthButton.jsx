import React from "react";
import { Button } from "@mui/material";

const AuthButton = ({
  children,
  isLoading = false,
  loadingText = "Loading...",
  fullWidth = true,
  sx,
  ...props
}) => {
  return (
    <Button
      type="submit"
      variant="contained"
      fullWidth={fullWidth}
      disabled={isLoading}
      sx={{
        py: 1.5,
        borderRadius: "10px",
        backgroundColor: "#0c2993ff",
        "&:hover": { backgroundColor: "#081f73" },
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "1rem",
        ...sx,
      }}
      {...props}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
};

export default AuthButton;