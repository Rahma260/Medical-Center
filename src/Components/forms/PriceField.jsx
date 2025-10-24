import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { AttachMoney } from "@mui/icons-material";

const PriceField = ({
  name = "consultationPrice",
  label = "Consultation Price",
  value,
  onChange,
  error,
  helperText,
  placeholder = "e.g., 50.00",
  fullWidth = true,
  ...props
}) => {
  return (
    <TextField
      label={label}
      name={name}
      fullWidth={fullWidth}
      type="number"
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AttachMoney sx={{ color: "#0c2993ff" }} />
          </InputAdornment>
        ),
        inputProps: { min: 0, step: "0.01" }
      }}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default PriceField;