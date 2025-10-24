import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import {
  MedicalServices,
  Badge,
  Work,
  School,
  AttachMoney,
  Description,
} from "@mui/icons-material";
import InfoWithIcon from "../InfoWithIcon";

const DoctorApplicationDetailsDialog = ({ open, doctor, onClose, formatPrice }) => {
  if (!doctor) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          color: "#0c2993",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <MedicalServices sx={{ color: "#ff66b2" }} />
        Dr. {doctor.firstName} {doctor.lastName}
      </DialogTitle>
      <DialogContent dividers>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 1,
          }}
        >
          {doctor.photo && (
            <Avatar
              src={doctor.photo}
              alt={`${doctor.firstName} ${doctor.lastName}`}
              sx={{ width: 100, height: 100 }}
            />
          )}

          <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            <InfoWithIcon
              icon={Badge}
              text={`Medical License: ${doctor.medicalLicense || "N/A"}`}
              color="#ff66b2"
            />
            <InfoWithIcon
              icon={Work}
              text={`Department: ${doctor.department || "N/A"}`}
              color="#0c2993"
            />
            <InfoWithIcon
              icon={School}
              text={`Experience: ${doctor.yearsOfExperience || 0} years`}
              color="#ff66b2"
            />
            <InfoWithIcon
              icon={Work}
              text={`Institution: ${doctor.institution || "N/A"}`}
              color="#0c2993"
            />
            <InfoWithIcon
              icon={AttachMoney}
              text={`Consultation Price: ${formatPrice(doctor.consultationPrice)}`}
              color="#ff66b2"
            />

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Description sx={{ color: "#ff66b2", mt: 0.5 }} />
              <Box>
                <Typography variant="body1" fontWeight={600} mb={1}>
                  Professional Bio:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {doctor.bio || "No bio provided"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#ff66b2",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "#ffe6f0",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorApplicationDetailsDialog;