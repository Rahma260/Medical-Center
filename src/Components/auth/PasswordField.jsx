import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const PasswordField = ({
  label = "Password",
  name = "password",
  value,
  onChange,
  required = true,
  fullWidth = true,
  margin = "normal",
  sx,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword(!showPassword);

  return (
    <TextField
      label={label}
      name={name}
      type={showPassword ? "text" : "password"}
      variant="outlined"
      fullWidth={fullWidth}
      margin={margin}
      required={required}
      value={value}
      onChange={onChange}
      sx={sx}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleToggle} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default PasswordField;