import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';

// Pages
import MainPage from './pages/main/MainPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import EventPage from './pages/event/EventPage';
import ProjectPage from './pages/project/ProjectPage';
import InquiryPage from './pages/inquiry/InquiryPage';
import MagazinePage from './pages/magazine/MagazinePage';
import AdminPage from './pages/admin/AdminPage';
import CheckPage from './pages/check/CheckPage';

// 인증 필요한 라우트 가드
function PrivateRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

// 이미 로그인 시 로그인·회원가입 접근 막기
function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 공개 라우트 */}
        <Route index element={<MainPage />} />
        <Route path="events" element={<EventPage />} />
        <Route path="projects" element={<ProjectPage />} />
        <Route path="inquiry" element={<InquiryPage />} />
        <Route path="magazine" element={<MagazinePage />} />
        <Route path="check" element={<CheckPage />} />

        {/* 비로그인 전용 */}
        <Route path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

        {/* 관리자 전용 */}
        <Route path="admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />

        {/* 404 처리 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
