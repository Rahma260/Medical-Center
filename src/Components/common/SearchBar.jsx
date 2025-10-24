import React from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  fullWidth = true
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth={fullWidth}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "#0c2993" }} />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                onClick={onClear}
                edge="end"
                size="small"
                sx={{
                  color: "#ff66b2",
                  "&:hover": {
                    bgcolor: "#fde4f0",
                  },
                }}
              >
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            bgcolor: "white",
            "& fieldset": {
              borderColor: "#e0e0e0",
            },
            "&:hover fieldset": {
              borderColor: "#0c2993",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0c2993",
            },
          },
        }}
        sx={{
          maxWidth: fullWidth ? "100%" : 400,
        }}
      />
    </Box>
  );
};

export default SearchBar;