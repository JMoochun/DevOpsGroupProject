import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './NavBar.css';

export default function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <header className="main-header">
                <div className="user-info">
                    <span className="welcome-text">Welcome: {user?.name || 'Example User'}</span>
                    <span className="branch-text">Branch: {user?.branch || 'Location'}</span>
                </div>

                <h1 className="system-title">Inventory Management System</h1>

                {/* USER PROFILE PLACEHOLDER - For future dropdown menu */}
                <div className="user-profile-section">
                    <div className="profile-dropdown">
                        <span className="profile-avatar">{user?.name?.[0] || 'U'}</span>
                        <span className="profile-name">{user?.name || 'User'}</span>
                        <span className="profile-arrow">▼</span>
                    </div>
                    {/* Future dropdown menu will be inserted here */}
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
        </>
    );
}