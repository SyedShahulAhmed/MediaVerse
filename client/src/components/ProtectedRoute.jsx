// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
    console.log("🔒 Checking user auth:", user);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
