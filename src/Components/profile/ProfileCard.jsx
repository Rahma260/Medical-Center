import React from "react";
import {
  Paper,
  Stack,
  Avatar,
  Typography,
  Chip,
  Divider,
  Box,
} from "@mui/material";

const ProfileCard = ({
  avatar,
  title,
  subtitle,
  badge,
  details,
  statistics,
  footer
}) => {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: 320 }, // Full width on mobile, fixed on desktop
        flexShrink: 0,
      }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          position: { xs: "relative", md: "sticky" }, // Not sticky on mobile
          top: { md: 20 },
        }}
      >
        <Stack alignItems="center" spacing={2}>
          {/* Avatar */}
          {avatar}

          {/* Title & Badge */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700} color="#0c2993">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {badge && <Box sx={{ mt: 1 }}>{badge}</Box>}
          </Box>

          <Divider sx={{ width: "100%" }} />

          {/* Details */}
          {details && (
            <Stack spacing={1.5} sx={{ width: "100%" }}>
              {details}
            </Stack>
          )}

          {statistics && (
            <>
              <Divider sx={{ width: "100%" }} />
              {statistics}
            </>
          )}

          {footer && (
            <>
              <Divider sx={{ width: "100%" }} />
              {footer}
            </>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProfileCard;