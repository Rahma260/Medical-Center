import React from "react";
import { Container, Stack, Typography, Box } from "@mui/material";

const ProfileLayout = ({ icon: Icon, title, children, iconColor = "#ff66b2" }) => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={4}>
        <Icon sx={{ fontSize: 32, color: iconColor }} />
        <Typography variant="h5" fontWeight={700} sx={{ color: "#0c2993" }}>
          {title}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          position: "relative",
        }}
      >
        {children}
      </Box>
    </Container>
  );
};

export default ProfileLayout;