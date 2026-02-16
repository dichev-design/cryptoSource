import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext";
import { HashRouter } from "react-router-dom";

// Optimize touch responsiveness - only prevent multi-touch zoom, allow single touch
document.addEventListener('touchmove', (e) => {
  // Only prevent if it's a multi-touch gesture (pinch zoom)
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: true }); // Keep passive for better performance

// Prevent gesture zoom (Safari/iOS)
document.addEventListener('gesturestart', (e) => {
  e.preventDefault();
}, { passive: false });

// Simple double-tap zoom prevention without blocking touch
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// Prevent scrolling on body without blocking performance
document.body.style.overflow = 'hidden';
document.documentElement.style.overflow = 'hidden';
document.body.style.position = 'fixed';
document.body.style.width = '100%';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
);
);
