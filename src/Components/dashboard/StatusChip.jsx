import React from "react";
import { Chip } from "@mui/material";

const StatusChip = ({ status, getStatusColor }) => {
  const colors = getStatusColor
    ? getStatusColor(status)
    : { bg: "#e3f2fd", color: "#0c2993" };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    />
  );
};

export default StatusChip;