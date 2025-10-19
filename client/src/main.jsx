import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MediaProvider } from "./context/MediaContext.jsx";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MediaProvider>
          <App />
        </MediaProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
