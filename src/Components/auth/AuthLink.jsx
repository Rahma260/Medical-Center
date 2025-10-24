import React from "react";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuthLink = ({ question, linkText, to, icon }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center", mt: 2 }}>
      {icon && <Box sx={{ display: "flex", alignItems: "center" }}>{icon}</Box>}
      <Typography variant="body2" color="text.secondary">
        {question}{" "}
        <Typography
          component="span"
          variant="body2"
          onClick={() => navigate(to)}
          sx={{
            color: "#0c2993",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              textDecoration: "underline",
              color: "#ff66b2",
            },
          }}
        >
          {linkText}
        </Typography>
      </Typography>
    </Box>
  );
};

export default AuthLink;