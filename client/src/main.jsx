import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MediaProvider } from "./context/MediaContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ Google OAuth provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ThemeProvider>
      <AuthProvider>
        <MediaProvider>
          <App />
        </MediaProvider>
      </AuthProvider>
    </ThemeProvider>
  </GoogleOAuthProvider>
);
