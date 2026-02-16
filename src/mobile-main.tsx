import React from "react";
import ReactDOM from "react-dom/client";
import MobileApp from "./MobileApp.tsx";
import "./styles/global.css";
import "./styles/tapping-game-mobile.css";
import { AuthProvider } from "./context/AuthContext";

// Optimize touch responsiveness for mobile
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: true });

document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// Prevent default browser double-tap zoom
document.addEventListener('dblclick', (e) => {
    e.preventDefault();
}, { passive: false });

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <MobileApp />
        </AuthProvider>
    </React.StrictMode>,
)
