import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

export default function CareAbout() {
  const items = [
    {
      title: "Patient Safety",
      desc: "We maintain the highest medical standards and hygiene protocols to ensure your complete safety and comfort.",
      icon: <HealthAndSafetyIcon sx={{ fontSize: 55, color: "#0c2993" }} />,
    },
    {
      title: "Modern Equipment",
      desc: "Equipped with advanced diagnostic and treatment technologies for precise and effective healthcare services.",
      icon: <MonitorHeartIcon sx={{ fontSize: 55, color: "#0c2993" }} />,
    },
    {
      title: "Qualified Doctors",
      desc: "Our expert doctors are dedicated to providing personalized, compassionate, and evidence-based care for all patients.",
      icon: <LocalHospitalIcon sx={{ fontSize: 55, color: "#0c2993" }} />,
    },
    {
      title: "Comprehensive Care",
      desc: "From consultation to recovery, we offer holistic medical services that address every aspect of your well-being.",
      icon: <MedicalInformationIcon sx={{ fontSize: 55, color: "#0c2993" }} />,
    },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      sx={{
        py: { xs: 6, md: 8 },
        textAlign: "center",
        background: "linear-gradient(180deg, #e8f1ff 0%, #ffffff 100%)",
        borderRadius: "20px",
        px: { xs: 2, md: 8 },
      }}
    >
      {/* Section Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#0c2993",
          mb: 6,
        }}
      >
        What We Care About
      </Typography>

      {/* Horizontal Cards Row */}
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: "center",
          alignItems: "stretch",
          overflowX: { xs: "auto", md: "visible" },
          pb: 2,
        }}
      >
        {items.map((item, index) => (
          <Card
            key={index}
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            sx={{
              flex: "1 1 250px",
              minWidth: 250,
              maxWidth: 300,
              borderRadius: "20px",
              boxShadow: "0 8px 25px rgba(12, 41, 147, 0.1)",
              textAlign: "center",
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              p: 3,
            }}
          >
            <CardContent>
              {item.icon}
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 1.5, mt: 2, color: "#0c2993" }}
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
    </Box>
  );
}
