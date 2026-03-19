import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import MainPage from './pages/main/MainPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import EventPage from './pages/event/EventPage';
import ProjectPage from './pages/project/ProjectPage';
import InquiryPage from './pages/inquiry/InquiryPage';
import MagazinePage from './pages/magazine/MagazinePage';
import AdminPage from './pages/admin/AdminPage';
import CheckPage from './pages/check/CheckPage';
import './styles/global.css';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.id !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<MainPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="events" element={<EventPage />} />
            <Route path="projects" element={<ProjectPage />} />
            <Route path="inquiry" element={<InquiryPage />} />
            <Route path="magazine" element={<MagazinePage />} />
            <Route path="check" element={<CheckPage />} />
            <Route path="admin" element={
              <PrivateRoute adminOnly>
                <AdminPage />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
