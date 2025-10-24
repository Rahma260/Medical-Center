import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  useMediaQuery,
  IconButton,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase";

// Icon mapping
const departmentIcons = {
  Neurology: <PsychologyIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  Cardiology: <FavoriteIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  Surgery: <MedicalServicesIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  Gastroenterology: <LocalHospitalIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  Dentistry: <MedicalServicesIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  Ophthalmology: <VisibilityIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  Pediatrics: <ChildCareIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  Orthopaedics: <AccessibilityNewIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  Orthopedics: <AccessibilityNewIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
  default: <LocalHospitalIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />,
};

const getIcon = (name) => {
  if (!name) return departmentIcons.default;
  const cleanName = name.trim();
  if (departmentIcons[cleanName]) return departmentIcons[cleanName];

  const lowerName = cleanName.toLowerCase();
  for (const [key, icon] of Object.entries(departmentIcons)) {
    if (key === "default") continue;
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return icon;
    }
  }
  return departmentIcons.default;
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const departmentsRef = collection(db, "Departments");
      const departmentsSnapshot = await getDocs(departmentsRef);

      const departmentsList = [];
      departmentsSnapshot.forEach((doc) => {
        const data = doc.data();
        departmentsList.push({
          id: doc.id,
          name: data.name || data.departmentName || doc.id,
          description: data.description || data.desc || "Providing quality healthcare services.",
          icon: getIcon(data.name || data.departmentName || doc.id),
        });
      });

      departmentsList.sort((a, b) => a.name.localeCompare(b.name));
      setDepartments(departmentsList);
      if (departmentsList.length === 0) {
        setError("No departments available at the moment.");
      }
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
      setError("Failed to load departments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      setTimeout(handleScroll, 300);
    }
  };

  React.useEffect(() => {
    handleScroll();
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
      return () => scrollRef.current?.removeEventListener("scroll", handleScroll);
    }
  }, [departments]);

  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={isMobile ? 40 : 60} sx={{ color: "#0c2993" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 6, px: 2 }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (departments.length === 0) {
    return (
      <Box sx={{ py: 8, px: 2, textAlign: "center" }}>
        <LocalHospitalIcon sx={{ fontSize: isMobile ? 50 : 60, color: "#e0e0e0", mb: 2 }} />
        <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
          No departments available at the moment.
        </Typography>
      </Box>
    );
  }

  const DepartmentCard = ({ dept, index }) => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      whileHover={{
        scale: isMobile ? 1 : 1.04,
        boxShadow: isMobile
          ? "0 4px 12px rgba(0,0,0,0.1)"
          : "0 10px 30px rgba(33,150,243,0.25)",
      }}
      sx={{
        width: "100%",
        maxWidth: isMobile ? 280 : 320,
        minHeight: isMobile ? 280 : 320,
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        backgroundColor: "rgba(255,255,255,0.85)",
        color: "#0c2993",
        p: { xs: 1.5, sm: 2.5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        transition: "all 0.3s ease",
        "&:hover .icon": {
          color: "#1976D2 !important",
          transform: isMobile ? "none" : "scale(1.15)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          width: "100%",
          p: 0,
        }}
      >
        <Box
          className="icon"
          sx={{
            mb: 1.5,
            color: "#0c2993",
            transition: "0.3s",
          }}
        >
          {dept.icon}
        </Box>
        <Typography
          variant={isMobile ? "subtitle1" : "h6"}
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "#df7d99",
            fontSize: { xs: "1rem", sm: "1.125rem" },
          }}
        >
          {dept.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.5,
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            px: { xs: 0.5, sm: 1 },
          }}
        >
          {dept.description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 1, sm: 2, md: 4 },
        background: "linear-gradient(135deg, #f4f9fd 0%, #dcecf8 40%, #d2e6f7 100%)",
        color: "#0c2993",
        textAlign: "center",
        borderRadius: "20px",
        mx: { xs: 1, sm: 2, md: "auto" },
        maxWidth: "1400px",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{ fontWeight: "bold", mb: 1.5, px: { xs: 1, sm: 0 } }}
      >
        Our Departments
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: { xs: 3, sm: 4, md: 6 },
          color: "text.secondary",
          px: { xs: 2, sm: 4 },
          maxWidth: 700,
          mx: "auto",
          fontSize: { xs: "0.875rem", sm: "1rem" },
        }}
      >
        Explore our comprehensive range of medical specialties and services
      </Typography>

      {/* Mobile/Tablet: Carousel */}
      {isTablet ? (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Left Arrow */}
          {canScrollLeft && (
            <IconButton
              onClick={() => scroll("left")}
              sx={{
                flex: "0 0 auto",
                bgcolor: "#0c2993",
                color: "white",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "#1976D2",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s",
                zIndex: 5,
                minWidth: { xs: 36, sm: 44 },
                minHeight: { xs: 36, sm: 44 },
              }}
              size={isMobile ? "small" : "medium"}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <Stack
            ref={scrollRef}
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "flex-start",
              alignItems: "stretch",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              pb: { xs: 1, sm: 2 },
              px: { xs: 1, sm: 1.5 },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              flex: 1,
              minWidth: 0,
            }}
          >
            {departments.map((dept, index) => (
              <Box
                key={dept.id}
                sx={{
                  flex: "0 0 auto",
                  scrollSnapAlign: "start",
                  width: { xs: "75vw", sm: "calc(50% - 8px)" },
                  maxWidth: { xs: 260, sm: 300 },
                }}
              >
                <DepartmentCard dept={dept} index={index} />
              </Box>
            ))}
          </Stack>

          {/* Right Arrow */}
          {canScrollRight && (
            <IconButton
              onClick={() => scroll("right")}
              sx={{
                flex: "0 0 auto",
                bgcolor: "#0c2993",
                color: "white",
                boxShadow: 2,
                "&:hover": {
                  bgcolor: "#1976D2",
                  transform: "scale(1.1)",
                },
                transition: "all 0.3s",
                zIndex: 5,
                minWidth: { xs: 36, sm: 44 },
                minHeight: { xs: 36, sm: 44 },
              }}
              size={isMobile ? "small" : "medium"}
            >
              <ArrowForwardIcon />
            </IconButton>
          )}
        </Box>
      ) : (
        // Desktop: Grid
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          justifyContent="center"
          sx={{ px: { xs: 0.5, sm: 1 } }}
        >
          {departments.map((dept, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={dept.id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <DepartmentCard dept={dept} index={index} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}