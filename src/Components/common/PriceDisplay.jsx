import React from "react";
import { Chip, Box, Typography } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const formatPrice = (price) => {
  if (!price) return "Contact for pricing";
  return `$${parseFloat(price).toFixed(2)}`;
};

const PriceDisplay = ({ price, variant = "chip", sx }) => {
  const formattedPrice = formatPrice(price);

  if (variant === 'chip') {
    return (
      <Chip
        icon={<AttachMoneyIcon sx={{ fontSize: 16 }} />}
        label={formattedPrice}
        size="small"
        sx={{
          backgroundColor: "#fff3e0",
          color: "#e65100",
          fontWeight: 700,
          fontSize: "0.85rem",
          ...sx,
        }}
      />
    );
  }

  if (variant === 'detail') {
    return (
      <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
        borderRadius: 1,
        bgcolor: "#fff8e1",
        border: "1px solid #ffe082"
      }}>
        <AttachMoneyIcon sx={{ color: "#f57c00", fontSize: 24 }} />
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
            Consultation Fee
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#e65100" }}>
            {formattedPrice}
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export default PriceDisplay;