import React from "react";
import { Card, Typography, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 2.5 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2, fontSize: "1.1rem" }}>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((btn, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(btn.path)}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                bgcolor: btn.color,
                fontSize: "0.9rem",
                fontWeight: 600,
                "&:hover": { bgcolor: "#0b1445" },
              }}
            >
              {btn.text}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default QuickActions;