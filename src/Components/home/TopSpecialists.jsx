import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ACCENT_BLUE = "#0c2993";
const TEAL_ACCENT = "#0c2993";

// Format price helper function
const formatPrice = (price) => {
  if (!price) return "N/A";
  return `$${parseFloat(price).toFixed(2)}`;
};

// DoctorCard component
const DoctorCard = ({ doctor, onHover }) => {
  const navigate = useNavigate();

  const getInitials = () => {
    return `${doctor.firstName?.charAt(0) || ""}${doctor.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
      <Card
        onMouseEnter={() => onHover(doctor.id)}
        onMouseLeave={() => onHover(null)}
        sx={{
          borderRadius: "16px",
          border: `3px solid ${doctor.rank === 1
              ? "#FFD700"
              : doctor.rank === 2
                ? "#C0C0C0"
                : doctor.rank === 3
                  ? "#CD7F32"
                  : "#90CAF9"
            }`,
          boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          textAlign: "center",
          height: "100%",
          minWidth: { xs: "280px", sm: "300px", md: "280px" },
          maxWidth: { xs: "280px", sm: "300px", md: "100%" },
          transition: "all 0.3s",
        }}
      >
        <Box sx={{ p: 1.5, position: "relative" }}>
          {/* Ranking Badge */}
          {doctor.rank <= 3 && (
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 10,
                backgroundColor:
                  doctor.rank === 1
                    ? "#ffd700"
                    : doctor.rank === 2
                      ? "#c0c0c0"
                      : "#cd7f32",
                color: "white",
                width: 35,
                height: 35,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "0.85rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              #{doctor.rank}
            </Box>
          )}

          <Avatar
            src={doctor.photo || ""}
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              mb: 2,
              border: `3px solid ${TEAL_ACCENT}`,
            }}
          >
            {!doctor.photo && getInitials()}
          </Avatar>

          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: TEAL_ACCENT, fontSize: "1.1rem" }}
          >
            Dr. {doctor.firstName} {doctor.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {doctor.department}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mt: 0.5,
            }}
          >
            <Rating
              name="read-only"
              value={doctor.rating || 4.5}
              precision={0.1}
              readOnly
              size="small"
            />
            <Typography variant="caption" color="text.secondary">
              ({doctor.reviews || 0})
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1, textAlign: "center", pb: 1 }}>
          {/* Price Display */}
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<AttachMoneyIcon sx={{ fontSize: 16 }} />}
              label={formatPrice(doctor.consultationPrice)}
              size="small"
              sx={{
                backgroundColor: "#fff3e0",
                color: "#e65100",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            />
          </Box>

          {/* Appointment Count Badge */}
          <Chip
            label={`${doctor.appointmentCount || 0} Appointments`}
            size="small"
            sx={{
              mt: 1,
              backgroundColor: "#e3f2fd",
              color: "#0c2993",
              fontWeight: "bold",
              fontSize: "0.75rem",
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            {doctor.scheduleCount || 0} available slots
          </Typography>

          {doctor.yearsOfExperience && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block" }}
            >
              {doctor.yearsOfExperience} years experience
            </Typography>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/doctor/${doctor.id}`)}
            sx={{
              backgroundColor: TEAL_ACCENT,
              fontWeight: "bold",
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              py: 0.8,
              fontSize: "0.9rem",
              width: "90%",
              "&:hover": {
                backgroundColor: "#1976D2",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(12, 41, 147, 0.3)",
              },
              transition: "all 0.3s",
            }}
          >
            View Profile & Book
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default function TopSpecialists() {
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredDoctorId, setHoveredDoctorId] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopDoctors();
  }, []);

  const fetchTopDoctors = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching top doctors...");

      const doctorsRef = collection(db, "Doctors");
      const doctorsSnapshot = await getDocs(doctorsRef);

      const doctorsWithMetrics = [];

      for (const doctorDoc of doctorsSnapshot.docs) {
        const doctorData = { id: doctorDoc.id, ...doctorDoc.data() };

        if (doctorData.status !== "Active") continue;

        try {
          const appointmentsRef = collection(db, "Appointments");
          const appointmentsQuery = query(
            appointmentsRef,
            where("doctorId", "==", doctorDoc.id)
          );
          const appointmentsSnapshot = await getDocs(appointmentsQuery);
          const appointmentCount = appointmentsSnapshot.size;

          const scheduleRef = collection(
            db,
            "Doctors",
            doctorDoc.id,
            "Schedule"
          );
          const scheduleSnapshot = await getDocs(scheduleRef);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const availableSlots = scheduleSnapshot.docs.filter(
            (scheduleDoc) => {
              const scheduleData = scheduleDoc.data();
              const slotDate = new Date(scheduleData.date);
              return scheduleData.status === "available" && slotDate >= today;
            }
          ).length;

          doctorsWithMetrics.push({
            ...doctorData,
            appointmentCount,
            scheduleCount: availableSlots,
          });
        } catch (error) {
          console.error(`Error processing doctor ${doctorDoc.id}:`, error);
        }
      }

      // Take top 10 doctors without sorting
      const topTen = doctorsWithMetrics.slice(0, 10).map((doctor, index) => ({
        ...doctor,
        rank: index + 1,
      }));

      console.log("✅ Top doctors fetched:", topTen);
      setTopDoctors(topTen);

      if (topTen.length === 0) {
        setError("No active doctors found.");
      }
    } catch (error) {
      console.error("❌ Error fetching top doctors:", error);
      setError("Failed to load top specialists. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: ACCENT_BLUE }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8, px: 2 }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (topDoctors.length === 0) {
    return (
      <Box sx={{ py: 8, px: 2, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No top specialists available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        textAlign: "center",
        borderRadius: "20px",
        px: { xs: 2, md: 4 },
        bgcolor: "#F4F8FB",
      }}
    >
      {/* Header with See All Link */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1200,
          mx: "auto",
          mb: 2,
          px: { xs: 1, md: 0 },
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: ACCENT_BLUE }}
          >
            Our Top Specialists
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            Meet our most trusted doctors
          </Typography>
        </Box>

        {/* See All Button */}
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/doctors")}
          sx={{
            borderColor: ACCENT_BLUE,
            color: ACCENT_BLUE,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: 3,
            px: 3,
            py: 1,
            fontSize: "0.95rem",
            "&:hover": {
              borderColor: ACCENT_BLUE,
              bgcolor: ACCENT_BLUE,
              color: "white",
              transform: "translateX(4px)",
            },
            transition: "all 0.3s",
          }}
        >
          See All Doctors
        </Button>
      </Box>

      {/* Horizontal Scroll View with Arrows - ALL SCREENS */}
      <Box sx={{ position: "relative", px: { xs: 0, md: 4 }, mt: 4 }}>
        {/* Left Arrow */}
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: { xs: -5, md: 0 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 3,
            width: { xs: 35, md: 45 },
            height: { xs: 35, md: 45 },
            "&:hover": { bgcolor: ACCENT_BLUE, color: "white" },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
        </IconButton>

        {/* Scrollable Container */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: "flex",
            gap: { xs: 2, md: 3 },
            overflowX: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            px: { xs: 5, md: 6 },
            py: 2,
          }}
        >
          {topDoctors.map((doctor) => (
            <Box key={doctor.id} sx={{ flexShrink: 0 }}>
              <DoctorCard doctor={doctor} onHover={setHoveredDoctorId} />
            </Box>
          ))}
        </Box>

        {/* Right Arrow */}
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: { xs: -5, md: 0 },
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 3,
            width: { xs: 35, md: 45 },
            height: { xs: 35, md: 45 },
            "&:hover": { bgcolor: ACCENT_BLUE, color: "white" },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: { xs: 18, md: 24 } }} />
        </IconButton>
      </Box>
    </Box>
  );
}