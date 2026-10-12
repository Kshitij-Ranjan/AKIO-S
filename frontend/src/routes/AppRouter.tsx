import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home/index.js';
import { Project } from '../pages/Project/index.js';
import { AboutPage } from '../pages/About/index.js';
import { ContactPage } from '../pages/Contact/index.js';
import { NotFound } from '../pages/NotFound/index.js';
import { PublicLayout } from '../components/layout/PublicLayout.js';
import { AdminLayout } from '../components/layout/AdminLayout.js';
import { ProtectedRoute } from './ProtectedRoute.js';

// Admin imports
import { AdminLogin } from '../pages/Admin/Login/index.js';
import { AdminDashboard } from '../pages/Admin/Dashboard/index.js';
import { AdminProjectForm } from '../pages/Admin/ProjectForm/index.js';
import { AdminSettings } from '../pages/Admin/Settings/index.js';

export function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects/:slug" element={<Project />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/projects" replace />} />
          <Route path="/admin/projects" element={<AdminDashboard />} />
          <Route path="/admin/projects/new" element={<AdminProjectForm />} />
          <Route path="/admin/projects/:id/edit" element={<AdminProjectForm />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
