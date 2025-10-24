import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  Rating,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Modal,
  Stack,
  Grid,
  Paper,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedIcon from "@mui/icons-material/Verified";
import LockIcon from "@mui/icons-material/Lock";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import AppointmentForm from "./AppointmentForm";
import { useSchedule } from "../../hooks/useSchedule";
import { useAlert } from "../../hooks/useAlert";

const ACCENT_BLUE = "#0c2993";
const LIGHT_BG = "#F5F8FC";
const CARD_BG = "#FFFFFF";
const SOFT_BORDER = "1px solid rgba(12, 41, 147, 0.08)";

// Helper
const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") return "Contact for pricing";
  const num = Number(price);
  return Number.isFinite(num) ? `$${num.toFixed(2)}` : "Contact for pricing";
};

// Section wrapper
function Section({ title, children }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: 0.2, color: ACCENT_BLUE }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function DoctorDetailsPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState(null);

  const { schedule, loading: loadingSchedule, refetch: refetchSchedule } = useSchedule(doctorId);
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!doctorId) {
        showAlert("No doctor ID provided", "error");
        setLoadingDoctor(false);
        return;
      }
      try {
        const docRef = doc(db, "Doctors", doctorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDoctor({ id: docSnap.id, ...docSnap.data() });
        } else {
          showAlert("Doctor not found. Please check the URL or try again.", "error");
        }
      } catch (error) {
        console.error("Error fetching doctor:", error);
        showAlert("Failed to load doctor profile", "error");
      } finally {
        setLoadingDoctor(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  const getInitials = () => {
    if (!doctor) return "";
    return `${doctor.firstName?.[0] || ""}${doctor.lastName?.[0] || ""}`.toUpperCase();
  };

  const handleBookSlot = (slot) => {
    if (slot.status === "booked") {
      showAlert("This slot is already booked. Please choose another time.", "warning");
      return;
    }
    setSelectedSlotDetails({
      ...slot,
      doctorId,
      doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "",
      department: doctor?.department,
      photo: doctor?.photo,
    });
    setShowAppointmentForm(true);
  };

  const handleAppointmentSuccess = async (appointmentData) => {
    try {
      const slotRef = doc(db, "Doctors", doctorId, "Schedule", selectedSlotDetails.id);
      await updateDoc(slotRef, {
        status: "booked",
        bookedBy: appointmentData.patientId || null,
        bookedAt: new Date().toISOString(),
        appointmentId: appointmentData.appointmentId || null,
      });
      showAlert("Appointment booked successfully! The slot has been reserved.", "success");
      handleCloseAppointmentForm();
    } catch (error) {
      console.error("Error updating slot status:", error);
      showAlert("Slot update failed after booking. Please check system status.", "warning");
    }
  };

  const handleCloseAppointmentForm = () => {
    setShowAppointmentForm(false);
    setSelectedSlotDetails(null);
    refetchSchedule();
  };

  // Loading
  if (loadingDoctor) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", bgcolor: LIGHT_BG }}>
        <CircularProgress color="primary" size={56} />
      </Box>
    );
  }

  // Not found
  if (!doctor) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Doctor not found. Please check the URL or try again.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/doctors")} sx={{ backgroundColor: ACCENT_BLUE }}>
          Back to Doctors List
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: `radial-gradient(1200px 600px at 10% -10%, rgba(12,41,147,0.06) 0%, rgba(12,41,147,0.0) 60%)`,
        py: 6,
        px: { xs: 2, md: 6, lg: 8 },
      }}
    >
      {/* Header / Hero */}
      <Card
        sx={{
          mb: 4,
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          background: CARD_BG,
          border: SOFT_BORDER,
          boxShadow: "0 12px 28px rgba(12,41,147,0.08)",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
          <Avatar
            src={doctor.photo || ""}
            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
            sx={{
              width: 120,
              height: 120,
              border: "3px solid #fff",
              boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
              bgcolor: ACCENT_BLUE,
              fontSize: "2.2rem",
              fontWeight: 800,
            }}
          >
            {!doctor.photo && getInitials()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: 0.3, color: ACCENT_BLUE }}>
              Dr. {doctor.firstName} {doctor.lastName}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "text.secondary", mt: 0.5 }}>
              {doctor.department}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1.5 }}>
              <Chip
                icon={<StarIcon sx={{ color: "#f4e3edff" }} />}
                label={`${doctor.rating || 4.5} • ${doctor.reviews || 0} reviews`}
                variant="outlined"
                sx={{ borderColor: "rgba(12,41,147,0.2)" }}
              />
              <Chip
                icon={<AttachMoneyIcon sx={{ color: "#e60096ff" }} />}
                label={formatPrice(doctor.consultationPrice)}
                sx={{
                  bgcolor: "#f4e3edff",
                  color: "#e60096ff",
                  fontWeight: 700,
                }}
              />
              <Chip
                icon={<VerifiedIcon sx={{ color: doctor.status === "Active" ? "#2e7d32" : "#f57c00" }} />}
                label={doctor.status || "N/A"}
                variant="outlined"
                sx={{ borderColor: "rgba(12,41,147,0.2)" }}
              />
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => window.location.href = `tel:${doctor.phone}`}
              sx={{
                border: SOFT_BORDER,
                bgcolor: "#ffffff",
                "&:hover": { bgcolor: ACCENT_BLUE, color: "white" },
              }}
            >
              <PhoneIcon />
            </IconButton>
            <IconButton
              onClick={() => window.location.href = `mailto:${doctor.email}`}
              sx={{
                border: SOFT_BORDER,
                bgcolor: "#ffffff",
                "&:hover": { bgcolor: ACCENT_BLUE, color: "white" },
              }}
            >
              <EmailIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Card>

      {/* Main layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          alignItems: "flex-start",
        }}
      >
        {/* Left – Compact info card */}
        <Box sx={{ width: { xs: "100%", lg: "22%" }, flexShrink: 0, position: { lg: "sticky" }, top: 20 }}>
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 10px 24px rgba(12,41,147,0.08)",
                backgroundColor: CARD_BG,
                border: SOFT_BORDER,
                p: 3,
              }}
            >
              <Section title="Contact">
                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2">{doctor.institution || "Location not specified"}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{doctor.phone || "N/A"}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <EmailIcon fontSize="small" color="action" sx={{ mt: 0.3 }} />
                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                      {doctor.email}
                    </Typography>
                  </Stack>
                </Stack>
              </Section>

              <Divider sx={{ my: 2 }} />

              <Section title="Consultation">
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    borderColor: "rgba(12,41,147,0.12)",
                    background: "linear-gradient(160deg, #f7dfecff 0%, #f4e3edff 100%)",
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Fee
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#e60096ff" }}>
                      {formatPrice(doctor.consultationPrice)}
                    </Typography>
                  </Stack>
                </Paper>
              </Section>
            </Card>
          </motion.div>
        </Box>

        {/* Right – Details & Slots */}
        <Box sx={{ width: { xs: "100%", lg: "78%" } }}>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 12px 28px rgba(12,41,147,0.08)",
                backgroundColor: CARD_BG,
                border: SOFT_BORDER,
                p: { xs: 2, md: 4 },
              }}
            >
              <Section title="About">
                <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.85 }}>
                  {doctor.bio || "Experienced medical professional dedicated to providing quality healthcare."}
                </Typography>
              </Section>

              <Section title="Professional Details">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderColor: "rgba(12,41,147,0.12)" }}>
                      <Typography variant="caption" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {doctor.yearsOfExperience || 0} years
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderColor: "rgba(12,41,147,0.12)" }}>
                      <Typography variant="caption" color="text.secondary">
                        Institution
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {doctor.institution || "N/A"}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Section>

              <Section title="Contact Information">
                <Stack spacing={1.2}>
                  <Typography variant="body2">
                    <strong>Email:</strong> {doctor.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {doctor.phone || "Not provided"}
                  </Typography>
                </Stack>
              </Section>


            </Card>
          </motion.div>

          {/* Available Slots */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: { xs: 2, md: 3 },
              borderRadius: 4,
              backgroundColor: CARD_BG,
              border: SOFT_BORDER,
              boxShadow: "0 12px 28px rgba(12,41,147,0.08)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: ACCENT_BLUE }}>
              Available Appointment Slots
            </Typography>
            {loadingSchedule ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : schedule.length === 0 ? (
              <Alert severity="info" variant="outlined">
                No upcoming slots found. Check back later.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {schedule.map((s) => {
                  const isBooked = s.status === "booked";
                  const isAvailable = s.status === "available";
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={s.id}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          borderColor: isBooked ? "rgba(0,0,0,0.12)" : "rgba(12,41,147,0.25)",
                          backgroundColor: isBooked ? "#fafafa" : "#ffffff",
                          transition: "all 0.25s",
                          cursor: isAvailable ? "pointer" : "not-allowed",
                          "&:hover": isAvailable ? { transform: "translateY(-3px)", boxShadow: "0 12px 24px rgba(12,41,147,0.18)" } : {},
                        }}
                        onClick={() => isAvailable && handleBookSlot(s)}
                      >
                        <Stack spacing={0.5} alignItems="center">
                          <Typography fontWeight={700} color={ACCENT_BLUE}>
                            {s.date}
                          </Typography>
                          <Typography fontWeight={600} color="text.primary">
                            {s.startTime} – {s.endTime}
                          </Typography>
                          {s.notes && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                              {s.notes}
                            </Typography>
                          )}
                        </Stack>
                        <Chip
                          icon={isBooked ? <LockIcon /> : <EventAvailableIcon />}
                          label={isBooked ? "Booked" : "Book Now"}
                          size="small"
                          sx={{
                            mt: 1.25,
                            width: "100%",
                            fontWeight: 700,
                            ...(isBooked
                              ? { bgcolor: "#ececec", color: "#555" }
                              : { bgcolor: "#afc3e6ff", color: ACCENT_BLUE }),
                          }}
                        />
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Appointment Modal */}
      <Modal open={showAppointmentForm} onClose={handleCloseAppointmentForm}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", md: "640px" },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: CARD_BG,
            borderRadius: 4,
            border: SOFT_BORDER,
            boxShadow: "0 20px 48px rgba(12,41,147,0.18)",
            p: { xs: 2, md: 3 },
          }}
        >
          <AppointmentForm
            doctorId={selectedSlotDetails?.doctorId}
            doctorName={selectedSlotDetails?.doctorName}
            department={selectedSlotDetails?.department}
            initialDate={selectedSlotDetails?.date}
            initialTime={selectedSlotDetails?.startTime}
            slotId={selectedSlotDetails?.id}
            onClose={handleCloseAppointmentForm}
            onSuccess={handleAppointmentSuccess}
          />
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar open={alert.open} autoHideDuration={5000} onClose={hideAlert} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={alert.severity} onClose={hideAlert}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}