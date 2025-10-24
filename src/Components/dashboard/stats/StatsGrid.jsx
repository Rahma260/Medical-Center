import React from "react";
import { Grid } from "@mui/material";
import StatCard from "./StatCard";

const StatsGrid = ({ stats, loading = false }) => {
  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={loading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsGrid;