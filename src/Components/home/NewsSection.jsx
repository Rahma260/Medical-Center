import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ACCENT_BLUE = "#0c2993";
const LIGHT_BG = "#FFFFFF";

const featuredNews = {
  title: "Updated Covid boosters rolling out a month ago. Here's how many Americans have gotten them.",
  description:
    "Many parts of the country are still in an updated booster rollout stage, so it's not particularly surprising that the Covid shot numbers have been lower than the flu's so far.",
  img: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80",
  link: "#",
};

const trendingNews = [
  {
    title: "Pumping Iron Improves Longevity in Older Adults",
    description:
      "Those who report weightlifting show reductions in all-cause and cardiovascular disease-related mortality.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Monkeypox Case Rates 5 Times Higher Among Black Americans",
    description:
      "Disparities in testing access, staffing, awareness, events, exhibitions, publications, and initiatives hosted by or featuring AMA members.",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "The Happy Hormone: Why We Shouldn't Mess With Oxytocin",
    description:
      "Matching people and environments sent out by the Not-So-Obvious Commerce Clause of the AMA's Communications Office.",
    img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=400&q=80",
  },
];

export default function NewsSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 3, md: 8 },
        backgroundColor: LIGHT_BG,
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 5,
        }}
      >
        {/* LEFT SIDE - BIG Featured Article */}
        <Box sx={{ flex: "0 0 55%", minWidth: 0 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#000",
              mb: 3,
              lineHeight: 1.3,
            }}
          >
            What you need to know about healthy living
          </Typography>

          {/* Featured Image - BIGGER */}
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            sx={{
              position: "relative",
              borderRadius: "20px",
              overflow: "hidden",
              mb: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              component="img"
              src={featuredNews.img}
              alt={featuredNews.title}
              sx={{
                width: "100%",
                height: { xs: 280, md: 400 },
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Featured Content */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#000",
              mb: 2,
              lineHeight: 1.4,
            }}
          >
            {featuredNews.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.8,
            }}
          >
            {featuredNews.description}
          </Typography>

          <Button
            variant="text"
            sx={{
              color: ACCENT_BLUE,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              p: 0,
              "&:hover": {
                backgroundColor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Read More
          </Button>
        </Box>

        {/* RIGHT SIDE - Smaller Trending Cards */}
        <Box sx={{ flex: "0 0 40%", minWidth: 0 }}>
          {/* Header with See More */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#000",
              }}
            >
              What's Trending?
            </Typography>

            <Button
              endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: ACCENT_BLUE,
                fontWeight: "600",
                textTransform: "none",
                fontSize: "0.9rem",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              See More
            </Button>
          </Box>

          {/* Trending News List - Compact */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {trendingNews.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Box
                  component={motion.div}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    display: "flex",
                    gap: 2,
                    cursor: "pointer",
                    p: 1.5,
                    borderRadius: "12px",
                    "&:hover": {
                      backgroundColor: "#F9FBFF",
                    },
                  }}
                >
                  {/* Smaller Thumbnail */}
                  <Box
                    component="img"
                    src={item.img}
                    alt={item.title}
                    sx={{
                      width: 90,
                      height: 75,
                      objectFit: "cover",
                      borderRadius: "10px",
                      flexShrink: 0,
                    }}
                  />

                  {/* Content */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        color: ACCENT_BLUE,
                        mb: 0.5,
                        lineHeight: 1.3,
                        fontSize: "0.9rem",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.5,
                        fontSize: "0.8rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}