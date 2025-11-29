import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from "react";
import ProfileModal from "../components/ProfileModal.jsx"; 
import './NavBar.css';

export default function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Controls showing/hiding the profile modal
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // First name from AuthContext user
    const firstName = user?.firstName || "User";
    const avatarLetter = firstName[0].toUpperCase() || "U";

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <header className="main-header">
                <div className="user-info">
                    <span className="welcome-text">Welcome: {firstName || 'Example User'}</span>
                    <span className="branch-text">Branch: {user?.branch || 'Location'}</span>
                </div>

                <h1 className="system-title">Inventory Management System</h1>

                {/* USER PROFILE SECTION */}
                <div className="user-profile-section">
                    <div
                        className="profile-button"
                        onClick={() => setIsProfileOpen(true)}   // open the profile modal
                    >
                        <span className="profile-avatar">{avatarLetter}</span>
                        <span className="profile-name">{firstName}</span>
                    </div>
                </div>
            </header>

            <nav className="top-navigation">
                <div className="nav-links">
                    <NavLink to="/home" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Home
                    </NavLink>
                    <NavLink to="/reports" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Reports
                    </NavLink>
                    <NavLink to="/notifications" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        Notifications ({user?.unreadCount || 0})
                    </NavLink>
                    {user?.role === 'manager' && (
                        <NavLink to="/inventory" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                            IMS
                        </NavLink>
                    )}
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </nav>
            
            {/* Profile Modal*/}
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)}/>
        </>
    );
}