import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Inventory from "./pages/Inventory.jsx";
import Reports from "./pages/Reports.jsx";
import Notifications from "./pages/Notifications.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

function App() {
    const location = useLocation();
    const { user } = useAuth();

    // Routes that should NOT show navbar
    const authRoutes = ["/", "/register", "/forgot-password"];
    const hideNav = authRoutes.includes(location.pathname);

    return (
        <div className="app-shell">
            {!hideNav && <NavBar />}
            <div className={hideNav ? "auth-body" : "app-body"}>
                <div className={hideNav ? "" : "app-content"}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/inventory"
                            element={
                                <ProtectedRoute>
                                    <Inventory />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/reports"
                            element={
                                <ProtectedRoute>
                                    <Reports />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/notifications"
                            element={
                                <ProtectedRoute>
                                    <Notifications />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirect unknown routes */}
                        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

// Export wrapped component for main.jsx
export default function AppWrapper() {
    return (
        <AuthProvider>
            <App />
        </AuthProvider>
    );
}