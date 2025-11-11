import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";

// Pages
import Landing from "./components/Landing";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import IdCard from "./components/IdCard";
import Lectures from "./components/Lectures";
import ChangePassword from "./components/ChangePassword";
import VolunteerApplicationForm from "./components/VolunteerApplicationForm";

// Admin components
import AdminDashboard from "./components/admin/AdminDashboard";
import LectureForm from "./components/admin/LectureForm";
import LectureManagement from "./components/admin/LectureManagement";

// Admin pages
import Courses from "./components/admin/Courses";
import Posts from "./components/admin/Posts";
import VolunteerManagement from "./components/admin/VolunteerManagement";
import PendingApprovals from "./components/admin/PendingApprovals";
import TrusteeManagement from "./components/admin/TrusteeManagement";
import AdminManagement from "./components/admin/AdminManagement";

// Trustee pages
import Stats from "./components/trustee/Stats";
import Members from "./components/trustee/Members";
import TrusteePosts from "./components/trustee/Posts";
import TrusteeCourses from "./components/trustee/Courses";

// Volunteer pages
import MyCourses from "./components/volunteer/MyCourses";
import MyPosts from "./components/volunteer/MyPosts";
import VolunteerTasks from "./components/volunteer/VolunteerTasks";

// Developer pages
import AuditLogs from "./components/developer/AuditLogs";
import ErrorLogs from "./components/developer/ErrorLogs";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/volunteer/apply" element={<VolunteerApplicationForm />} />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/id-card"
            element={
              <ProtectedRoute>
                <IdCard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lectures"
            element={
              <ProtectedRoute>
                <Lectures />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <Courses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/posts"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <Posts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/volunteers"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <VolunteerManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/trustees"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <TrusteeManagement />
              </ProtectedRoute>
            }
          />

          {/* Trustee routes */}
          <Route
            path="/trustee/stats"
            element={
              <ProtectedRoute roles={["trustee", "superadmin", "developer"]}>
                <Stats />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trustee/members"
            element={
              <ProtectedRoute roles={["trustee", "superadmin", "developer"]}>
                <Members />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trustee/posts"
            element={
              <ProtectedRoute roles={["trustee", "superadmin", "developer"]}>
                <TrusteePosts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trustee/courses"
            element={
              <ProtectedRoute roles={["trustee", "superadmin", "developer"]}>
                <TrusteeCourses />
              </ProtectedRoute>
            }
          />

          {/* Volunteer routes */}
          <Route
            path="/volunteer/my-courses"
            element={
              <ProtectedRoute roles={["volunteer", "admin", "superadmin", "developer"]}>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/volunteer/my-posts"
            element={
              <ProtectedRoute roles={["volunteer", "admin", "superadmin", "developer"]}>
                <MyPosts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/volunteer/tasks"
            element={
              <ProtectedRoute roles={["volunteer", "admin", "superadmin", "developer"]}>
                <VolunteerTasks />
              </ProtectedRoute>
            }
          />

          {/* Additional Admin routes */}
          <Route
            path="/admin/pending-approvals"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <PendingApprovals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/manage-admins"
            element={
              <ProtectedRoute roles={["superadmin", "developer"]}>
                <AdminManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lectures"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <LectureManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lectures/new"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <LectureForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/lectures/edit/:id"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <LectureForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin", "superadmin", "developer"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Developer routes */}
          <Route
            path="/logs/audit"
            element={
              <ProtectedRoute roles={["developer", "superadmin"]}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/logs/errors"
            element={
              <ProtectedRoute roles={["developer", "superadmin"]}>
                <ErrorLogs />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
