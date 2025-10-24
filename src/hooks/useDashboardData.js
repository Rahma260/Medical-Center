import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/firebase";

export const useDashboardData = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalDoctors: 0,
    totalAppointments: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Patients"));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
  };

  const fetchDoctors = async () => {
    try {
      const q = query(collection(db, "Doctors"), where("status", "==", "Active"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return [];
    }
  };

  const fetchAppointments = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Appointments"));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return [];
    }
  };

  const calculateMonthlyData = (appointments) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();

    const monthlyStats = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = monthNames[date.getMonth()];
      monthlyStats[monthKey] = { month: monthKey, appointments: 0, patients: new Set() };
    }

    appointments.forEach((apt) => {
      const aptDate = new Date(apt.date || apt.createdAt);
      if (aptDate.getFullYear() === currentYear) {
        const monthKey = monthNames[aptDate.getMonth()];
        if (monthlyStats[monthKey]) {
          monthlyStats[monthKey].appointments++;
          if (apt.patientId) {
            monthlyStats[monthKey].patients.add(apt.patientId);
          }
        }
      }
    });

    return Object.values(monthlyStats).map((stat) => ({
      month: stat.month,
      appointments: stat.appointments,
      patients: stat.patients.size,
    }));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsData, doctorsData, appointmentsData] = await Promise.all([
        fetchPatients(),
        fetchDoctors(),
        fetchAppointments(),
      ]);

      const today = new Date().toISOString().split("T")[0];
      const todayAppointments = appointmentsData.filter((apt) => apt.date === today).length;

      setStats({
        totalPatients: patientsData.length,
        todayAppointments,
        totalDoctors: doctorsData.length,
        totalAppointments: appointmentsData.length,
      });

      const total = patientsData.length + doctorsData.length;
      setPieData([
        {
          name: "Patients",
          value: patientsData.length,
          percentage: total > 0 ? ((patientsData.length / total) * 100).toFixed(1) : 0,
        },
        {
          name: "Doctors",
          value: doctorsData.length,
          percentage: total > 0 ? ((doctorsData.length / total) * 100).toFixed(1) : 0,
        },
      ]);

      setMonthlyData(calculateMonthlyData(appointmentsData));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { stats, monthlyData, pieData, loading, error, fetchData };
};