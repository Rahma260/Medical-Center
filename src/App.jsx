import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import DashboardLayout from './Components/dashboard/DashboardLayout';
import Patients from './Pages/dashboard/Patients';
import Appointments from './Pages/dashboard/Appointments';
import Doctors from './Pages/dashboard/Doctors';
import DashboardHome from './Pages/dashboard/DashboardHome';
import Home from './Pages/User/Home';
import Layout from './Components/Layout';
import DoctorDetailsPage from './Pages/User/DoctorDetailsPage';
import DoctorListPage from './Pages/User/DoctorsListPage';
import LoginPage from './Pages/auth/LoginPage';
import RegisterPage from './Pages/auth/RegisterPage';
import AppointmentForm from './Pages/User/AppointmentForm';
import DoctorApplicationForm from './Pages/User/DoctorApply';
import DoctorApplications from './Pages/dashboard/DoctorApplications';
import DoctorProfile from './Pages/profiles/DoctorProfile';
import PatientProfile from './Pages/profiles/PatientProfile';
import AdminProfile from './Pages/profiles/AdminProfile';
import ForgotPasswordPage from './Pages/auth/ForgotPasswordPage';
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5c8d',
      dark: '#9a0036',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#2e7d32',
    },
    info: {
      main: '#0288d1',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Routes>
            <Route path="/dashboared" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="patients" element={<Patients />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="doctor-applications" element={<DoctorApplications />} />
              <Route path="admin-profile" element={<AdminProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='doctor/:doctorId' element={<DoctorDetailsPage />} />
              <Route path='doctors' element={<DoctorListPage />} />
              <Route path='profile/:doctorId' element={<DoctorProfile />} />
              <Route path='apply' element={<DoctorApplicationForm />} />
              <Route path='book' element={<AppointmentForm />} />
              <Route path="/patient-profile/:patientId" element={<PatientProfile />} />
            </Route>
            <Route path='login' element={<LoginPage />} />
            <Route path='register' element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;