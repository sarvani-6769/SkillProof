import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicProfilePage from './pages/PublicProfilePage';
import SearchProfilesPage from './pages/SearchProfilesPage';
import NotFoundPage from './pages/NotFoundPage';

// Student pages
import StudentDashboard from './pages/StudentDashboard';
import StudentProfilePage from './pages/StudentProfilePage';
import SkillsPage from './pages/SkillsPage';
import CertificatesPage from './pages/CertificatesPage';
import ProjectsPage from './pages/ProjectsPage';
import InternshipsPage from './pages/InternshipsPage';
import AchievementsPage from './pages/AchievementsPage';
import VerificationTrackerPage from './pages/VerificationTrackerPage';

// Admin / Verifier pages
import AdminDashboard from './pages/AdminDashboard';
import AdminVerificationRequestsPage from './pages/AdminVerificationRequestsPage';
import AdminStudentsPage from './pages/AdminStudentsPage';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/:username" element={<PublicProfilePage />} />
        <Route path="/search" element={<SearchProfilesPage />} />
      </Route>

      {/* Student Protected Routes */}
      <Route element={<StudentLayout />}>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<StudentProfilePage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/internships" element={<InternshipsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/verification-requests" element={<VerificationTrackerPage />} />
      </Route>

      {/* Admin & Verifier Protected Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/requests" element={<AdminVerificationRequestsPage />} />
        <Route path="/admin/records" element={<AdminVerificationRequestsPage />} />
        <Route path="/admin/students" element={<AdminStudentsPage />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
