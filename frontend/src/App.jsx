import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ROLES } from "./constants/roles";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import StudentDashboard from "./pages/student/StudentDashboard";
import CreateComplaint from "./pages/student/CreateComplaint";
import ComplaintDetails from "./pages/student/ComplaintDetails";

import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import VerifyComplaint from "./pages/teacher/VerifyComplaint";

import NotFound from "./pages/NotFound";

function Unauthorized() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-gray-900">403 - Access Denied</h1>
      <p className="text-sm text-gray-500 mt-2">You do not have permission to view this page.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/complaints/new" element={<CreateComplaint />} />
          <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
        </Route>

        {/* Teacher Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.TEACHER]} />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/complaints/:id/verify" element={<VerifyComplaint />} />
        </Route>

        {/* Admin Protected Routes (Next Module) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route
            path="/admin/dashboard"
            element={<div className="p-8 text-lg font-bold">Admin Module (Next)</div>}
          />
        </Route>

        {/* Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}