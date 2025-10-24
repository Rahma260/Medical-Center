import React from "react";
import { Box, Typography } from "@mui/material";

const FormSection = ({ icon: Icon, title, children, bgcolor = "#f8faff" }) => {
  return (
    <Box
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: "1px solid #dce3f5",
        bgcolor,
      }}
    >
      {title && (
        <Typography
          variant="h6"
          fontWeight={700}
          color="#0c2993ff"
          mb={2}
          display="flex"
          alignItems="center"
          gap={1}
        >
          {Icon && <Icon />}
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default FormSection;