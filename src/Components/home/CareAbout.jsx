import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

export default function CareAbout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const items = [
    {
      title: "Patient Safety",
      desc: "We maintain the highest medical standards and hygiene protocols to ensure your complete safety and comfort.",
      icon: <HealthAndSafetyIcon sx={{ fontSize: { xs: 45, sm: 55 }, color: "#0c2993" }} />,
    },
    {
      title: "Modern Equipment",
      desc: "Equipped with advanced diagnostic and treatment technologies for precise and effective healthcare services.",
      icon: <MonitorHeartIcon sx={{ fontSize: { xs: 45, sm: 55 }, color: "#0c2993" }} />,
    },
    {
      title: "Qualified Doctors",
      desc: "Our expert doctors are dedicated to providing personalized, compassionate, and evidence-based care for all patients.",
      icon: <LocalHospitalIcon sx={{ fontSize: { xs: 45, sm: 55 }, color: "#0c2993" }} />,
    },
    {
      title: "Comprehensive Care",
      desc: "From consultation to recovery, we offer holistic medical services that address every aspect of your well-being.",
      icon: <MedicalInformationIcon sx={{ fontSize: { xs: 45, sm: 55 }, color: "#0c2993" }} />,
    },
  ];

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

      // Update arrow visibility after scroll
      setTimeout(handleScroll, 300);
    }
  };

  React.useEffect(() => {
    handleScroll();
    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
      return () => scrollRef.current?.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        textAlign: "center",
        background: "linear-gradient(180deg, #e8f1ff 0%, #ffffff 100%)",
        borderRadius: "20px",
        px: { xs: 2, sm: 3, md: 8 },
      }}
    >
      {/* Section Title */}
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{
          fontWeight: "bold",
          color: "#0c2993",
          mb: { xs: 3, sm: 4, md: 6 },
          px: { xs: 1, sm: 0 },
        }}
      >
        What We Care About
      </Typography>

      {/* Mobile/Tablet Carousel with Arrows */}
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
          {/* Left Arrow - Inside wrapper */}
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

          {/* Scrollable Container */}
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
              minWidth: 0, // Allow flex to shrink below content size
            }}
          >
            {items.map((item, index) => (
              <Card
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: isMobile ? 1 : 1.05,
                  boxShadow: "0 12px 35px rgba(12, 41, 147, 0.15)",
                }}
                sx={{
                  flex: "0 0 auto",
                  scrollSnapAlign: "start",
                  width: { xs: "75vw", sm: "280px" }, // ✅ Reduced from 85vw to 75vw
                  maxWidth: { xs: 260, sm: 300 }, // ✅ Reduced max-width for mobile
                  minHeight: { xs: 260, sm: 320 }, // ✅ Reduced min-height for mobile
                  borderRadius: "20px",
                  boxShadow: "0 8px 25px rgba(12, 41, 147, 0.1)",
                  textAlign: "center",
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: { xs: 1.5, sm: 3 }, // ✅ Reduced padding for mobile
                  transition: "all 0.3s",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                    {item.icon}
                  </Box>
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"} // ✅ Smaller variant for mobile
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      mt: 1,
                      color: "#0c2993",
                      fontSize: { xs: "0.95rem", sm: "1.1rem" }, // ✅ Reduced font size
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "gray",
                      fontSize: { xs: "0.8rem", sm: "0.95rem" }, // ✅ Reduced font size
                      lineHeight: 1.5,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>

          {/* Right Arrow - Inside wrapper */}
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
        // Desktop: Static Grid (4 cards in a row)
        <Stack
          direction="row"
          spacing={3}
          sx={{
            justifyContent: "center",
            alignItems: "stretch",
            flexWrap: "wrap",
            gap: { xs: 2, md: 3 },
          }}
        >
          {items.map((item, index) => (
            <Card
              key={index}
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 12px 35px rgba(12, 41, 147, 0.15)",
                y: -5,
              }}
              sx={{
                flex: "1 1 calc(25% - 20px)",
                minWidth: 250,
                maxWidth: 300,
                minHeight: 320,
                borderRadius: "20px",
                boxShadow: "0 8px 25px rgba(12, 41, 147, 0.1)",
                textAlign: "center",
                backgroundColor: "white",
                border: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 3,
                transition: "all 0.3s",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                  {item.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1.5,
                    mt: 1,
                    color: "#0c2993",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: "gray",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}