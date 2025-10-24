import React from "react";
import {
  Paper,
  Stack,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Delete, Lock, EventAvailable } from "@mui/icons-material";

const ACCENT_BLUE = "#0c2993";

const ScheduleSlotCard = ({ slot, onDelete, canDelete = true }) => {
  const isBooked = slot.status === "booked";
  const isAvailable = slot.status === "available";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        borderColor: isBooked ? "rgba(0,0,0,0.12)" : "rgba(12,41,147,0.25)",
        backgroundColor: isBooked ? "#fafafa" : "#ffffff",
        transition: "all 0.25s",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 20px rgba(12,41,147,0.15)",
        },
      }}
    >
      <Stack spacing={0.5} alignItems="center" sx={{ mb: 2 }}>
        <Typography fontWeight={700} color={ACCENT_BLUE} variant="body1">
          {slot.date}
        </Typography>
        <Typography fontWeight={600} color="text.primary" variant="body2">
          {slot.startTime} – {slot.endTime}
        </Typography>
        {slot.notes && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, fontStyle: "italic", textAlign: "center" }}
          >
            {slot.notes}
          </Typography>
        )}
      </Stack>

      <Box>
        <Chip
          icon={isBooked ? <Lock /> : <EventAvailable />}
          label={isBooked ? "Booked" : "Available"}
          size="small"
          sx={{
            width: "100%",
            fontWeight: 700,
            mb: 1.5,
            ...(isBooked
              ? { bgcolor: "#ececec", color: "#555" }
              : { bgcolor: "#e7f0ff", color: ACCENT_BLUE }),
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {canDelete && !isBooked ? (
            <Tooltip title="Delete slot">
              <IconButton
                color="error"
                onClick={() => onDelete(slot.id)}
                size="small"
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(211, 47, 47, 0.08)",
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={isBooked ? "Cannot delete booked slot. Cancel the appointment first." : "Cannot delete this slot"}>
              <span>
                <IconButton
                  disabled
                  size="small"
                  sx={{
                    opacity: 0.4,
                  }}
                >
                  <Delete />
                </IconButton>
              </span>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ScheduleSlotCard;