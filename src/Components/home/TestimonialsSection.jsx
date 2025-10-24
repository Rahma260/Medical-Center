import React from "react";
import { Box, Typography, Rating, Avatar, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const LIGHT_TEAL = "#E3F2FD";
const ACCENT_TEAL = "#1976D2";
const MAIN_TEXT_COLOR = "#212121";

const testimonials = [
  {
    name: "John Doe",
    role: "Engineer",
    feedback:
      "Augue nulla montes, eget congue dolor magna vitae porttitor. Mollis aliquam tristique porttitor blandit nibh dui tristique quam......",
    rating: 5,
    img: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Jane Smith",
    role: "Doctor",
    feedback:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium......",
    rating: 5,
    img: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Ali Hassan",
    role: "Nurse",
    feedback:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos......",
    rating: 5,
    img: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Sarah Johnson",
    role: "Patient",
    feedback:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit......",
    rating: 5,
    img: "https://i.pravatar.cc/150?img=4",
  },

];

const ClippedAvatar = ({ img, name }) => (
  <Box
    sx={{
      position: "absolute",
      bottom: -10,
      right: 0,
      width: 90,
      height: 90,
      zIndex: 2,
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "50%",
        transform: "rotate(-15deg) translateX(10px) translateY(10px)",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 15% 100%, 0% 100%)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        zIndex: 0,
      }}
    />
    <Avatar
      src={img}
      alt={name}
      sx={{
        width: 65,
        height: 65,
        position: "absolute",
        bottom: 8,
        right: 8,
        zIndex: 1,
        border: "3px solid white",
      }}
    />
  </Box>
);

export default function TestimonialsSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 8 },
        backgroundColor: "white",
        textAlign: "left",
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 1,
          color: MAIN_TEXT_COLOR,
        }}
      >
        Testimonials
      </Typography>
      <Typography variant="body1" sx={{ mb: 6, color: "text.secondary" }}>
        Our patients and specialists share their experiences and feedback
        about our trusted medical services.
      </Typography>

      {/* --- Grid Layout (4 cards per row on desktop) --- */}
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
        }}
      >
        {testimonials.map((t, index) => (
          <Box
            key={index}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            sx={{
              backgroundColor: LIGHT_TEAL,
              borderRadius: "24px",
              p: 3,
              position: "relative",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              "&:hover": {
                transform: "translateY(-6px)",
                transition: "0.3s",
              },
            }}
          >
            <Typography variant="body2" sx={{ color: "#444", mb: 2 }}>
              {t.feedback}
            </Typography>
            <Rating
              name={`rating-${index}`}
              value={t.rating}
              precision={1}
              readOnly
              size="small"
              sx={{ color: ACCENT_TEAL, mb: 1 }}
              icon={<FiberManualRecordIcon fontSize="inherit" />}
              emptyIcon={
                <FiberManualRecordIcon
                  fontSize="inherit"
                  style={{ opacity: 0.3 }}
                />
              }
            />
            <Box sx={{ mt: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: MAIN_TEXT_COLOR }}
              >
                {t.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t.role}
              </Typography>
            </Box>
            <ClippedAvatar img={t.img} name={t.name} />
          </Box>
        ))}
      </Box>

      {/* --- Dots --- */}
      <Box sx={{ mt: 6, textAlign: "center" }}>
        {testimonials.map((dot, index) => (
          <IconButton key={index} size="small" disableRipple>
            <FiberManualRecordIcon
              sx={{
                color: index === 0 ? ACCENT_TEAL : LIGHT_TEAL,
                fontSize: index === 0 ? 14 : 12,
              }}
            />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}
