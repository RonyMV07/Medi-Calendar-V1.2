import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastContainer } from 'react-toastify'; 
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import ChartsPage from './pages/ChartsPage';
import NotesBookPage from './pages/NotesBookPage';
import MedicacionPage from './pages/MedicacionPage';
import CitasPage from './pages/CitasPage';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();

  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      <Route
        path="/calendar"
        element={
          <PrivateRoute>
            <CalendarPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/charts"
        element={
          <PrivateRoute>
            <ChartsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <PrivateRoute>
            <NotesBookPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/medicacion"
        element={
          <PrivateRoute>
            <MedicacionPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/citas"
        element={
          <PrivateRoute>
            <CitasPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
