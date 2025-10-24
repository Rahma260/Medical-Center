import React from "react";
import { Stack, IconButton } from "@mui/material";

const ActionButtons = ({ actions }) => {
  return (
    <Stack direction="row" spacing={1} justifyContent="center">
      {actions.map((action, index) => (
        <IconButton
          key={index}
          size="small"
          onClick={action.onClick}
          sx={{
            bgcolor: action.bgcolor,
            color: action.color,
            "&:hover": {
              bgcolor: action.hoverBg,
              color: action.hoverColor || "white",
            },
          }}
          title={action.title}
        >
          {action.icon}
        </IconButton>
      ))}
    </Stack>
  );
};

export default ActionButtons;