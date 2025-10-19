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
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      {/* ✅ Global Toast Provider (place it here, once only) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1800,
          style: {
            background: "linear-gradient(135deg, #0b0b0f 0%, #151518 100%)",
            color: "#e5e5e5",
            borderRadius: "10px",
            padding: "10px 16px",
            border: "1px solid rgba(147, 51, 234, 0.3)", // soft purple border
            boxShadow:
              "0 0 15px rgba(147, 51, 234, 0.2), 0 0 30px rgba(236, 72, 153, 0.1)",
            backdropFilter: "blur(8px)", // glassy blur
            marginTop: "70px",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.3px",
            fontSize: "0.9rem",
          },
          success: {
            iconTheme: {
              primary: "#a855f7", // glowing purple
              secondary: "#0b0b0f",
            },
            style: {
              background:
                "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.2))",
              border: "1px solid rgba(168,85,247,0.5)",
              boxShadow:
                "0 0 20px rgba(168,85,247,0.3), 0 0 40px rgba(236,72,153,0.2)",
              color: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#fb7185",
              secondary: "#0b0b0f",
            },
            style: {
              background:
                "linear-gradient(135deg, rgba(239,68,68,0.3), rgba(190,18,60,0.2))",
              border: "1px solid rgba(239,68,68,0.5)",
              boxShadow: "0 0 20px rgba(239,68,68,0.3)",
              color: "#fff",
            },
          },
        }}
      />

      {/* ✅ Your app layout and routes */}
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
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

          {/* Public user profile */}
          <Route path="/u/:username" element={<PublicProfile />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
