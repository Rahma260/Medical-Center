import React from "react";
import { Box, Typography, Avatar, Stack } from "@mui/material";
import { CalendarMonth, Schedule } from "@mui/icons-material";

const DoctorInfoCard = ({
  doctorName,
  department,
  date,
  time,
  photo
}) => {
  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        backgroundColor: "#f5f7ff",
        borderRadius: 2,
        border: "1px solid #e3f2fd"
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {photo && (
          <Avatar
            src={photo}
            sx={{
              width: 60,
              height: 60,
              border: "2px solid #0c2993ff"
            }}
          />
        )}
        <Box flex={1}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0c2993" }}>
            {doctorName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {department}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarMonth fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {date}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Schedule fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {time}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default DoctorInfoCard;