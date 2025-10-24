import React from "react";
import { Box, Typography, Grid, Button, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HealingIcon from "@mui/icons-material/Healing";

const benefits = [
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 40, color: "#0c2993" }} />,
    title: "Modern Clinic",
    desc: "Our clinics are equipped with the latest medical technology to ensure accurate diagnosis and effective treatment.",
  },
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 40, color: "#0c2993" }} />,
    title: "Less Consultation Fees",
    desc: "We provide affordable consultation fees without compromising the quality of care you receive.",
  },
  {
    icon: <HealingIcon sx={{ fontSize: 40, color: "#0c2993" }} />,
    title: "Professional Treatment",
    desc: "Experienced doctors and specialists ensure that every patient receives top-notch medical attention.",
  },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

export default function BenefitsSection() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 8 },
        backgroundColor: "#E3F2FD",
        display: "flex",
        alignItems: "center",
        flexDirection: { xs: "column", md: "row" },
        gap: 6,
      }}
    >
      {/* Left Image Section */}
      <Box
        component={motion.div}
        initial={{ rotate: -6, opacity: 0 }}
        whileInView={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 500,
            borderRadius: "24px",
            overflow: "visible",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
          component={motion.div}
          whileHover={{
            scale: 1.03,
            rotate: -3,
            transition: { duration: 0.4 },
          }}
        >
          {/* Main large tilted image */}
          <Box
            component={motion.img}
            src="/images/doctor-surgery.jpg"
            alt="Main Surgery"
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: "30px",
            }}
            whileHover={{ scale: 1.05 }}
          />

          {/* Small overlay image (bottom right corner) */}
          <Box
            component={motion.img}
            src="/images/doctor-surgery2.jpg"
            alt="Consultation"
            sx={{
              position: "absolute",
              bottom: "-5px",
              right: "-15px",
              width: "45%",
              height: "auto",
              borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            }}
            whileHover={{ scale: 1.08 }}
          />
        </Box>

        {/* Buttons */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          sx={{ display: "flex", gap: 2 }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#0c2993",
              color: "white",
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#1976D2" },
            }}
          >
            Emergency
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#0c2993",
              color: "#0c2993",
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#0c2993", color: "white" },
            }}
          >
            Consultation →
          </Button>
        </Box>
      </Box>

      {/* Right Benefits Section */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 4, color: "#0c2993" }}
          component={motion.div}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          The Benefits of utilizing Medicare
        </Typography>

        <Grid container spacing={3}>
          {benefits.map((item, index) => (
            <Grid item xs={12} key={index}>
              <Card
                component={motion.div}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: "16px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                  backgroundColor: "white",
                }}
              >
                {item.icon}
                <CardContent sx={{ p: 0 }}>
                  <Typography variant="h6" sx={{ color: "#0c2993" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
