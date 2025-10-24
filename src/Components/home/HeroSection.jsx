import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants for staggered letters/words
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Delay between each child (letter/word)
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      skewX: 10
    },
    visible: {
      opacity: 1,
      y: 0,
      skewX: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Back ease for bounce effect
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: -90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  // Split heading into words for animation
  const headingWords = [
    { text: "Your", variant: wordVariants },
    { text: "Health", variant: wordVariants },
    { text: "Comes", variant: wordVariants },
    { text: "First.", variant: letterVariants, style: { color: "#0c2993ff" } },
  ];

  // Services cards data with animations
  const services = [
    {
      icon: AccessTimeIcon,
      title: "24 Hours Services",
      description: "Round-the-clock medical support whenever you need it.",
      color: "#4facfe",
    },
    {
      icon: WorkspacePremiumIcon,
      title: "10 Years of Experience",
      description: "Trusted expertise with a proven track record of excellence.",
      color: "#43e97b",
    },
    {
      icon: FavoriteIcon,
      title: "High Quality Care",
      description: "Personalized treatment with compassion and precision.",
      color: "#fa709a",
    },
  ];

  const serviceVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.2,
        ease: "easeOut",
      },
    }),
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f9f9ff 0%, #e8f4fd 100%)",
        py: { xs: 6, md: 12 },
        px: { xs: 2, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Particles */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              background: "#0c2993",
              borderRadius: "50%",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg">
        <Grid
          container
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
          sx={{ position: "relative", zIndex: 2 }}
        >
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Animated Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    color: "#0c2993",
                    mb: 3,
                    opacity: 0.8,
                  }}
                >
                  Welcome to Premium Healthcare
                </Typography>
              </motion.div>

              {/* Animated Heading - Staggered Words */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style={{ display: "inline-block" }}
              >
                {headingWords.map((word, index) => (
                  <motion.span
                    key={index}
                    variants={word.variant}
                    style={{
                      display: "inline-block",
                      marginRight: index < headingWords.length - 1 ? "0.5rem" : 0,
                      ...word.style,
                    }}
                  >
                    {word.text}
                    {index === 0 && <br />}
                  </motion.span>
                ))}
              </motion.div>

              {/* Animated Subtitle Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: "#666666",
                    mb: 5,
                    lineHeight: 1.8,
                    maxWidth: 450,
                  }}
                >
                  Experience compassionate care with our expert medical team. We
                  provide comprehensive healthcare services tailored to your
                  unique needs, ensuring your well-being every step of the way.
                </Typography>
              </motion.div>

              {/* Animated Buttons */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Link to="/doctors" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#0c2993",
                        color: "#fff",
                        fontWeight: 700,
                        textTransform: "none",
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        borderRadius: 3,
                        boxShadow: "0 6px 20px rgba(12, 41, 147, 0.3)",
                        "&:hover": {
                          bgcolor: "#071a6b",
                          boxShadow: "0 8px 25px rgba(12, 41, 147, 0.4)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      See Our Doctors
                    </Button>
                  </motion.div>
                </Link>

                <Link to="/apply" style={{ textDecoration: "none" }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: "#0c2993",
                        color: "#0c2993",
                        fontWeight: 700,
                        textTransform: "none",
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        borderRadius: 3,
                        borderWidth: 2,
                        "&:hover": {
                          bgcolor: "#0c2993",
                          color: "#fff",
                          borderColor: "#0c2993",
                          boxShadow: "0 6px 20px rgba(12, 41, 147, 0.2)",
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      Join as Doctor
                    </Button>
                  </motion.div>
                </Link>
              </Box>
            </motion.div>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: 100, opacity: 0, rotate: 5 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Animated Background Shape */}
              <motion.div
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 0.3 }}
                transition={{ duration: 1, delay: 0.8 }}
                sx={{
                  position: "absolute",
                  top: "10%",
                  width: 450,
                  height: 450,
                  background: "linear-gradient(135deg, #c8d9f9 0%, #a8c8e8 100%)",
                  borderRadius: "50%",
                  zIndex: 1,
                  filter: "blur(20px)",
                }}
              />

              {/* Animated Doctor Image */}
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                sx={{
                  zIndex: 2,
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  src="/images/doctor-hero.png"
                  alt="Doctor"
                  sx={{
                    width: "100%",
                    maxWidth: 450,
                    borderRadius: "24px",
                    boxShadow: "0 20px 60px rgba(12, 41, 147, 0.15)",
                  }}
                />
              </motion.div>

              {/* Animated Review Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  right: "15%",
                  bgcolor: "white",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                  px: 3,
                  py: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  border: "2px solid #0c2993",
                }}
              >
                <Box
                  sx={{
                    bgcolor: "#0c2993",
                    color: "white",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    ★
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#0c2993" }}>
                    4.9 Rating
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    1,200+ Happy Patients
                  </Typography>
                </Box>
              </motion.div>
            </motion.div>
          </Grid>
        </Grid>

        {/* Animated Services Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          sx={{
            mt: 12,
            background: "linear-gradient(135deg, #0c2993 0%, #1a58ff 100%)",
            color: "white",
            borderRadius: "24px",
            p: { xs: 4, md: 6 },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Services Background Decoration */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              bgcolor: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          />

          <Grid container spacing={4} justifyContent="center">
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={service.title}>
                <motion.div
                  variants={serviceVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                >
                  <Card
                    sx={{
                      bgcolor: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(10px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.3)",
                      textAlign: "center",
                      p: 3,
                      height: "100%",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                        bgcolor: "rgba(255,255,255,1)",
                      },
                    }}
                  >
                    <CardContent sx={{ pb: 0 }}>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        style={{ display: "inline-block", marginBottom: "16px" }}
                      >
                        <service.icon sx={{ fontSize: 48, color: service.color }} />
                      </motion.div>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 2, color: "#0c2993" }}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#4a4a4a", lineHeight: 1.6 }}
                      >
                        {service.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;