import React from "react";
import { Card, CardContent, CardActions, Avatar, Typography, Stack, Box, IconButton } from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import PriceDisplay from "../common/PriceDisplay";

const DoctorCard = ({ doctor, onEdit, onDelete, onView }) => {
  // ... (getInitials logic remains the same)
  const getInitials = () => {
    return `${doctor.firstName?.charAt(0) || ""}${doctor.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.3 }}>
      <Card sx={{ borderRadius: "20px", p: 3, border: `1px solid #E0E0E0`, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <CardContent sx={{ textAlign: "center", flexGrow: 1 }}>
          <Avatar
            src={doctor.photo || ""}
            sx={{ width: 100, height: 100, mx: "auto", mb: 2, border: "3px solid #0c2993" }}
          >
            {!doctor.photo && getInitials()}
          </Avatar>

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0c2993" }}>
            Dr. {doctor.firstName} {doctor.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {doctor.department}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <PriceDisplay price={doctor.consultationPrice} variant="chip" />
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            {doctor.scheduleCount > 0 ? `${doctor.scheduleCount} slots available` : "No immediate availability"}
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", pb: 2 }}>
          <IconButton size="small" onClick={() => onView?.(doctor)}>
            <Visibility sx={{ color: "#0c2993" }} />
          </IconButton>
          <IconButton size="small" onClick={() => onEdit?.(doctor)}>
            <Edit sx={{ color: "orange" }} />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete?.(doctor.docId)}>
            <Delete sx={{ color: "#ff66b2" }} />
          </IconButton>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default DoctorCard;