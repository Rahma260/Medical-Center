import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Pending,
  CalendarMonth,
  AccessTime,
  MedicalServices,
  LocalHospital,
} from "@mui/icons-material";

const getStatusInfo = (status) => {
  switch (status?.toLowerCase()) {
    case "confirmed":
      return { color: "success", icon: <CheckCircle fontSize="small" />, label: "Confirmed" };
    case "completed":
      return { color: "primary", icon: <CheckCircle fontSize="small" />, label: "Completed" };
    case "cancelled":
      return { color: "error", icon: <Cancel fontSize="small" />, label: "Cancelled" };
    case "pending":
    default:
      return { color: "warning", icon: <Pending fontSize="small" />, label: "Pending" };
  }
};

const AppointmentCard = ({
  appointment,
  actions,
  showDoctor = false,
  showPatient = false
}) => {
  const statusInfo = getStatusInfo(appointment.status);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        transition: "all 0.3s",
        borderLeft: `4px solid ${statusInfo.color === "success"
            ? "#4caf50"
            : statusInfo.color === "primary"
              ? "#2196f3"
              : statusInfo.color === "error"
                ? "#f44336"
                : "#ff9800"
          }`,
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocalHospital sx={{ color: "#0c2993" }} />
                  <Typography variant="h6" fontWeight={600} color="#0c2993">
                    {showDoctor ? appointment.doctorName : appointment.patientName}
                  </Typography>
                </Stack>
                <Chip
                  icon={statusInfo.icon}
                  label={statusInfo.label}
                  size="small"
                  color={statusInfo.color}
                />
              </Stack>

              <Stack direction="row" spacing={3} flexWrap="wrap">
                {appointment.department && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <MedicalServices fontSize="small" color="action" />
                    <Typography variant="body2">{appointment.department}</Typography>
                  </Stack>
                )}

                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarMonth fontSize="small" color="action" />
                  <Typography variant="body2">{appointment.date}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime fontSize="small" color="action" />
                  <Typography variant="body2">
                    {appointment.time || appointment.startTime || "Not set"}
                  </Typography>
                </Stack>
              </Stack>

              {appointment.reason && (
                <Box sx={{ bgcolor: "#f8f9fa", p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Reason:</strong> {appointment.reason}
                  </Typography>
                </Box>
              )}

              {appointment.updatedAt && (
                <Typography variant="caption" color="text.secondary">
                  Last updated: {new Date(appointment.updatedAt).toLocaleString()}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            {actions ? (
              <Stack spacing={1}>{actions}</Stack>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  p: 2,
                  bgcolor: "#f5f7ff",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" fontWeight={700} color="#0c2993">
                  {appointment.date?.split("-")[2] || ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(appointment.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </Typography>
                <Typography variant="h6" color="#ff66b2" sx={{ mt: 1 }}>
                  {appointment.time || appointment.startTime}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;