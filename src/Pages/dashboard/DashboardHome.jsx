import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import {
  People,
  Schedule,
  MedicalServices,
  Receipt,
} from "@mui/icons-material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase/firebase";
import DashboardHeader from "../../Components/dashboard/DashboardHeader";
import StatsGrid from "../../Components/dashboard/stats/StatsGrid";
import LineChartCard from "../../Components/dashboard/charts/LineChartCard";
import PieChartCard from "../../Components/dashboard/charts/PieChartCard";
import QuickActions from "../../Components/dashboard/QuickActions";
import LoadingState from "../../Components/dashboard/LoadingState";
import ErrorState from "../../Components/dashboard/ErrorState";
import { useDashboardData } from "../../hooks/useDashboardData";

const colors = {
  darkBlue: "#1A237E",
  midBlue: "#3949AB",
  darkPink: "#C2185B",
  lightPink: "#F48FB1",
  bg: "#F7F8FC",
};

export default function DashboardHome() {
  const { stats, monthlyData, pieData, loading, error, fetchData } = useDashboardData();

  const statsConfig = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: <People sx={{ fontSize: 32 }} />,
      color: colors.darkBlue,
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: <Schedule sx={{ fontSize: 32 }} />,
      color: colors.midBlue,
    },
    {
      title: "Active Doctors",
      value: stats.totalDoctors,
      icon: <MedicalServices sx={{ fontSize: 32 }} />,
      color: colors.darkPink,
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: <Receipt sx={{ fontSize: 32 }} />,
      color: colors.lightPink,
    },
  ];

  const quickActions = [
    { text: "+ Add Patient", color: colors.darkBlue, path: "/dashboared/patients" },
    { text: "View Appointments", color: colors.midBlue, path: "/dashboared/appointments" },
    { text: "Manage Doctors", color: colors.darkPink, path: "/dashboared/doctors" },
    { text: "View Applications", color: colors.lightPink, path: "/dashboared/doctor-applications" },
  ];

  const lineChartConfig = [
    { dataKey: "appointments", name: "Appointments" },
    { dataKey: "patients", name: "Patients" },
  ];

  if (loading) return <LoadingState bgcolor={colors.bg} />;
  if (error) return <ErrorState error={error} onRetry={fetchData} bgcolor={colors.bg} />;

  return (
    <Box sx={{ p: 3, bgcolor: colors.bg, minHeight: "100vh" }}>
      <DashboardHeader
        title="Dashboard Overview"
        subtitle="Welcome back 👋 Here's what's happening today."
        color={colors.darkBlue}
      />

      <StatsGrid stats={statsConfig} loading={loading} />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <LineChartCard
            title="Monthly Performance (Last 7 Months)"
            data={monthlyData}
            lines={lineChartConfig}
            colors={[colors.darkBlue, colors.darkPink]}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          <PieChartCard
            title="Doctors vs Patients Distribution"
            data={pieData}
            colors={[colors.darkBlue, colors.darkPink]}
            totalLabel="Total Users"
            totalValue={stats.totalPatients + stats.totalDoctors}
            borderColor={colors.darkPink}
          />
        </Grid>
      </Grid>

      <QuickActions actions={quickActions} />
    </Box>
  );
};