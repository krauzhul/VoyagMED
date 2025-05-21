import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Tasks from './pages/Tasks';
import Journal from './pages/Journal';
import Drugs from './pages/Drugs';
import MedicalData from './pages/MedicalData';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-50">
        <div className="animate-pulse text-primary-600">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-center">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/patients" element={user ? <Patients /> : <Navigate to="/login" replace />} />
        <Route path="/patients/:id" element={user ? <PatientDetail /> : <Navigate to="/login" replace />} />
        <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/login" replace />} />
        <Route path="/journal" element={user ? <Journal /> : <Navigate to="/login" replace />} />
        <Route path="/drugs" element={user ? <Drugs /> : <Navigate to="/login" replace />} />
        <Route path="/medical_data" element={user ? <MedicalData /> : <Navigate to="/login" replace />} />
        <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      
      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;