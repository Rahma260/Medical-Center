import React from "react";
import { Stack, Typography } from "@mui/material";

const InfoWithIcon = ({ icon: Icon, text, color = "#0c2993", bold = false }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Icon sx={{ fontSize: 18, color }} />
      <Typography fontWeight={bold ? 600 : 400}>{text}</Typography>
    </Stack>
  );
};

export default InfoWithIcon;