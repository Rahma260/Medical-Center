import React from "react";
import { Grid, Paper, Typography } from "@mui/material";

const StatisticsGrid = ({ stats }) => {
  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      {stats.map((stat, index) => (
        <Grid item xs={6} key={index}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: stat.bgcolor || "#f5f7ff",
            }}
          >
            <Typography variant="h5" fontWeight={700} color={stat.color || "#0c2993"}>
              {stat.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatisticsGrid;