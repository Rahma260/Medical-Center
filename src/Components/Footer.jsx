import React from "react";
import { Box, Typography, Grid, TextField, Button, IconButton, Divider } from "@mui/material";
import { motion } from "framer-motion";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";

const ACCENT_BLUE = "#0c2993";
const LIGHT_BLUE = "#E0F7FA";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: ACCENT_BLUE,
        color: "white",
        pt: 8,
        pb: 3,
      }}
    >
      <Box sx={{ px: { xs: 3, md: 8 } }}>
        <Grid container spacing={4}>
          {/* Company Info Section */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "white",
                }}
              >
                HealthCare<span style={{ color: LIGHT_BLUE }}>+</span>
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Providing quality healthcare services with compassion and excellence. Your health and well-being are our top priorities.
              </Typography>

              {/* Social Media Icons */}
              <Box sx={{ display: "flex", gap: 1 }}>
                {[
                  { icon: <FacebookIcon />, link: "#" },
                  { icon: <TwitterIcon />, link: "#" },
                  { icon: <InstagramIcon />, link: "#" },
                  { icon: <LinkedInIcon />, link: "#" },
                  { icon: <YouTubeIcon />, link: "#" },
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    component={motion.button}
                    whileHover={{ scale: 1.2, y: -3 }}
                    transition={{ duration: 0.2 }}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: LIGHT_BLUE,
                        color: ACCENT_BLUE,
                      },
                    }}
                    href={social.link}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "white",
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {["About Us", "Departments", "Doctors", "Services", "Careers", "Blog"].map(
                  (link, index) => (
                    <Typography
                      key={index}
                      component={motion.a}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      href="#"
                      sx={{
                        color: "rgba(255,255,255,0.8)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        "&:hover": {
                          color: LIGHT_BLUE,
                        },
                      }}
                    >
                      {link}
                    </Typography>
                  )
                )}
              </Box>
            </motion.div>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "white",
                }}
              >
                Services
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  "Emergency Care",
                  "Cardiology",
                  "Neurology",
                  "Pediatrics",
                  "Surgery",
                  "Laboratory",
                ].map((service, index) => (
                  <Typography
                    key={index}
                    component={motion.a}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    href="#"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                      "&:hover": {
                        color: LIGHT_BLUE,
                      },
                    }}
                  >
                    {service}
                  </Typography>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "white",
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <PhoneIcon sx={{ fontSize: 20, color: LIGHT_BLUE }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      +1 (555) 123-4567
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      +1 (555) 987-6543
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                  <EmailIcon sx={{ fontSize: 20, color: LIGHT_BLUE }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    info@healthcare.com
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                  <LocationOnIcon sx={{ fontSize: 20, color: LIGHT_BLUE }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    123 Medical Center Drive, Suite 100, New York, NY 10001
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={12} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "white",
                }}
              >
                Newsletter
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: 1.6,
                }}
              >
                Subscribe to get the latest health tips and updates.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  p: 0.5,
                }}
              >
                <TextField
                  placeholder="Enter your email"
                  variant="standard"
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      color: "white",
                      px: 1.5,
                      fontSize: "0.9rem",
                      "& ::placeholder": {
                        color: "rgba(255,255,255,0.6)",
                      },
                    },
                  }}
                />
                <IconButton
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    backgroundColor: LIGHT_BLUE,
                    color: ACCENT_BLUE,
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>

              {/* Working Hours */}
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    color: "white",
                  }}
                >
                  Working Hours
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Mon - Fri: 8:00 AM - 8:00 PM
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                  Sat - Sun: 9:00 AM - 5:00 PM
                </Typography>
                <Typography variant="body2" sx={{ color: LIGHT_BLUE, mt: 0.5 }}>
                  Emergency: 24/7
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Divider */}
        <Divider sx={{ my: 4, backgroundColor: "rgba(255,255,255,0.1)" }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.7)",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            © 2025 HealthCare+. All rights reserved.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
              <Typography
                key={index}
                component="a"
                href="#"
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  "&:hover": {
                    color: LIGHT_BLUE,
                    textDecoration: "underline",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}