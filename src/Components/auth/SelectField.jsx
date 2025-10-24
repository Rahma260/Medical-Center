import React from "react";
import { TextField, MenuItem, InputAdornment } from "@mui/material";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  icon,
  required = true,
  fullWidth = true,
  margin = "normal",
  helperText,
  sx,
  ...props
}) => {
  return (
    <TextField
      select
      label={label}
      name={name}
      fullWidth={fullWidth}
      margin={margin}
      required={required}
      value={value}
      onChange={onChange}
      helperText={helperText}
      sx={sx}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : null,
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem
          key={typeof option === "string" ? option : option.value}
          value={typeof option === "string" ? option : option.value}
        >
          {typeof option === "string" ? option : option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectField;