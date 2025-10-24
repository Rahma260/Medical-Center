import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import PsychologyIcon from "@mui/icons-material/Psychology";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/firebase"; // Adjust import path

// Icon mapping for departments
const departmentIcons = {
  Neurology: <PsychologyIcon sx={{ fontSize: 60 }} />,
  Cardiology: <FavoriteIcon sx={{ fontSize: 60 }} />,
  Surgery: <MedicalServicesIcon sx={{ fontSize: 60 }} />,
  Gastroenterology: <LocalHospitalIcon sx={{ fontSize: 60 }} />,
  Dentistry: <MedicalServicesIcon sx={{ fontSize: 60 }} />,
  Ophthalmology: <VisibilityIcon sx={{ fontSize: 60 }} />,
  Pediatrics: <ChildCareIcon sx={{ fontSize: 60 }} />,
  Orthopaedics: <AccessibilityNewIcon sx={{ fontSize: 60 }} />,
  Orthopedics: <AccessibilityNewIcon sx={{ fontSize: 60 }} />,
  // Default icon for departments not in the map
  default: <LocalHospitalIcon sx={{ fontSize: 60 }} />,
};

// Helper function to get the appropriate icon
const getIcon = (name) => {
  // Try exact match first
  if (departmentIcons[name]) {
    return departmentIcons[name];
  }

  // Try case-insensitive partial match
  const lowerName = name.toLowerCase();
  for (const [key, icon] of Object.entries(departmentIcons)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return icon;
    }
  }

  // Return default icon
  return departmentIcons.default;
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);

      const departmentsRef = collection(db, "Departments");
      const departmentsSnapshot = await getDocs(departmentsRef);

      const departmentsList = [];
      departmentsSnapshot.forEach((doc) => {
        const data = doc.data();
        departmentsList.push({
          id: doc.id,
          name: data.name || data.departmentName || doc.id,
          description: data.description || data.desc || "Providing quality healthcare services.",
          icon: getIcon(data.name || data.departmentName || doc.id),
        });
      });

      // Sort alphabetically by name
      departmentsList.sort((a, b) => a.name.localeCompare(b.name));

      console.log("✅ Departments loaded:", departmentsList);
      setDepartments(departmentsList);

      if (departmentsList.length === 0) {
        setError("No departments available at the moment.");
      }
    } catch (error) {
      console.error("❌ Error fetching departments:", error);
      setError("Failed to load departments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#0c2993" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 8, px: 2 }}>
        <Alert severity="info" sx={{ maxWidth: 600, mx: "auto" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (departments.length === 0) {
    return (
      <Box sx={{ py: 8, px: 2, textAlign: "center" }}>
        <LocalHospitalIcon sx={{ fontSize: 60, color: "#e0e0e0", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No departments available at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background:
          "linear-gradient(135deg, #f4f9fdff 0%, #dcecf8ff 40%, #d2e6f7ff 100%)",
        color: "#0c2993",
        textAlign: "center",
        borderRadius: "20px",
        px: { xs: 2, md: 8 },
      }}
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 2, color: "#0c2993" }}
      >
        Our Departments
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 6, color: "text.secondary", maxWidth: 700, mx: "auto" }}
      >
        Explore our comprehensive range of medical specialties and services
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {departments.map((dept, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={dept.id}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#ffffff",
                boxShadow: "0 8px 25px rgba(33,150,243,0.2)",
              }}
              sx={{
                width: 280,
                minHeight: 340,
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                backgroundColor: "rgba(255,255,255,0.7)",
                color: "#0c2993",
                p: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                transition: "all 0.4s ease",
                "&:hover .icon": {
                  color: "#1976D2 !important",
                  transform: "scale(1.2)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Box
                  className="icon"
                  sx={{
                    mb: 2,
                    color: "#0c2993",
                    transition: "0.3s",
                  }}
                >
                  {dept.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", mb: 1.5, color: "#df7d99ff" }}
                >
                  {dept.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    flexGrow: 1,
                  }}
                >
                  {dept.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}