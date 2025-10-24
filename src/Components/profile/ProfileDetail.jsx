import React from "react";
import { Stack, Typography } from "@mui/material";

const ProfileDetail = ({ icon: Icon, text, color = "action" }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Icon fontSize="small" color={color} />
      <Typography variant="body2" sx={{ fontSize: "0.875rem", wordBreak: "break-word" }}>
        {text}
      </Typography>
    </Stack>
  );
};

export default ProfileDetail;