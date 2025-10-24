import React from "react";
import { TextField, InputAdornment } from "@mui/material";

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  icon,
  required = true,
  fullWidth = true,
  margin = "normal",
  sx,
  ...props
}) => {
  return (
    <TextField
      label={label}
      name={name}
      type={type}
      variant="outlined"
      fullWidth={fullWidth}
      margin={margin}
      required={required}
      value={value}
      onChange={onChange}
      sx={sx}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : null,
      }}
      {...props}
    />
  );
};

export default FormField;