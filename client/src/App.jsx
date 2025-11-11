import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
    // routes that should NOT show the navbar
    const authRoutes = ["/", "/register", "/forgot-password"];
    const hideNav = authRoutes.includes(location.pathname);

    return (
        <div className="app-shell">
            {!hideNav && <NavBar />}
            <div className={hideNav ? "auth-body" : "app-body"}>
                <div className={hideNav ? "" : "app-content"}>
                    <Routes>
                        {/* login functionality */}
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />

                        {/* Application */}
                        <Route path="/home" element={<Home />} />
                        <Route path="/inventory" element={<Inventory />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/notifications" element={<Notifications />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
