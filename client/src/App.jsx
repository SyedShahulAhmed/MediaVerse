// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Analytics from "./pages/Analytics.jsx";
import PublicProfile from "./pages/PublicProfile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./components/NotFound.jsx";
import BadgesPage from "./pages/Badges.jsx";
import Followers from "./pages/Followers.jsx";
import Following from "./pages/Following.jsx";
import CommunityFeed from "./pages/CommunityFeed.jsx";
import Settings from "./pages/Settings.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { Toaster } from "react-hot-toast";
// import VerifyOTP from "./pages/VerifyOTP.jsx";

export default function App() {
  return (
    <Router>
      {/* ✅ Global Toaster — visible across all pages */}
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: {
            background: "rgba(31, 27, 46, 0.95)",
            color: "#fff",
            border: "1px solid rgba(216,180,254,0.5)",
            borderRadius: "10px",
            padding: "12px 16px",
            boxShadow: "0 0 25px rgba(168,85,247,0.4)",
            backdropFilter: "blur(6px)",
            zIndex: 99999, // 🔥 keeps it above everything
          },
          success: {
            iconTheme: {
              primary: "#a855f7",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      {/* ✅ App Layout Wrapper */}
      <Layout>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} /> */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile/badges" element={<BadgesPage />} />
          <Route path="/followers" element={<Followers />} />
          <Route path="/following" element={<Following />} />
          <Route path="/community" element={<CommunityFeed />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/u/:username" element={<PublicProfile />} />

          {/* 🔐 Protected Routes */}
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
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* 🚫 Fallback Routes */}
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
