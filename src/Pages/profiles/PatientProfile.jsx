import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarMonth,
} from "@mui/icons-material";

import ProfileLayout from "../../Components/profile/ProfileLayout";
import ProfileCard from "../../Components/profile/ProfileCard";
import ProfileDetail from "../../Components/profile/ProfileDetail";
import StatisticsGrid from "../../Components/profile/StatisticsGrid";
import AppointmentCard from "../../Components/profile/AppointmentCard";

import { useProfile } from "../../hooks/useProfile";
import { useAppointments } from "../../hooks/useAppointments";
import { useAlert } from "../../hooks/useAlert";

const PatientProfile = () => {
  const { patientId } = useParams();

  const { profile: patient, loading: loadingPatient } = useProfile("Patients", patientId);
  const { appointments, loading: loadingAppointments } = useAppointments(patientId, "patientId");
  const { alert, hideAlert } = useAlert();

  const getInitials = () => {
    if (!patient) return "";
    const name = patient.name || patient.fullName || "";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || "P";
  };

  const stats = [
    {
      value: appointments.length,
      label: "Total",
      bgcolor: "#f5f7ff",
      color: "#0c2993",
    },
    {
      value: appointments.filter((apt) => apt.status?.toLowerCase() === "completed").length,
      label: "Completed",
      bgcolor: "#e8f5e9",
      color: "#2e7d32",
    },
    {
      value: appointments.filter((apt) => {
        const status = apt.status?.toLowerCase();
        return status === "pending" || status === "confirmed";
      }).length,
      label: "Upcoming",
      bgcolor: "#fff3e0",
      color: "#f57c00",
    },
    {
      value: appointments.filter((apt) => apt.status?.toLowerCase() === "cancelled").length,
      label: "Cancelled",
      bgcolor: "#ffebee",
      color: "#c62828",
    },
  ];

  if (loadingPatient) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Patient not found. Please check the URL or try logging in again.</Alert>
      </Box>
    );
  }

  return (
    <ProfileLayout icon={Person} title="Patient Profile">
      {/* Left: Profile Card */}
      <ProfileCard
        avatar={
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "#0c2993",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            {getInitials()}
          </Avatar>
        }
        title={patient.name || patient.fullName}
        badge={<Chip label="Patient" size="small" color="primary" />}
        details={
          <>
            <ProfileDetail icon={Email} text={patient.email} />
            <ProfileDetail icon={Phone} text={patient.phone || "N/A"} />
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2">{patient.address || "N/A"}</Typography>
            </Stack>
            <ProfileDetail icon={Person} text={`Gender: ${patient.gender || "N/A"}`} />
            {patient.createdAt && (
              <ProfileDetail
                icon={CalendarMonth}
                text={`Member since: ${new Date(patient.createdAt.seconds * 1000).toLocaleDateString()}`}
              />
            )}
          </>
        }
        statistics={<StatisticsGrid stats={stats} />}
      />

      {/* Right: Appointments */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h6" fontWeight={700} color="#0c2993">
              📋 My Appointments ({appointments.length})
            </Typography>
          </Stack>

          {loadingAppointments ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : appointments.length === 0 ? (
            <Alert severity="info">
              <Typography variant="body1" fontWeight={600}>
                No appointments yet
              </Typography>
              <Typography variant="body2">
                You haven't booked any appointments. Browse doctors and book your first appointment!
              </Typography>
            </Alert>
          ) : (
            <Stack spacing={2}>
              {appointments.map((apt) => (
                <AppointmentCard key={apt.id} appointment={apt} showDoctor />
              ))}
            </Stack>
          )}
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={hideAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={alert.severity} onClose={hideAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </ProfileLayout>
  );
};

export default PatientProfile;