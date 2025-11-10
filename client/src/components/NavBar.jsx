import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="top-nav">
            <div className="nav-left">
                <span className="brand">Inventory Management System</span>
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                >
                    Home
                </NavLink>
                <NavLink
                    to="/inventory"
                    className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                >
                    Inventory
                </NavLink>
                <NavLink
                    to="/reports"
                    className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                >
                    Reports
                </NavLink>
                <NavLink
                    to="/notifications"
                    className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                >
                    Notifications
                </NavLink>
            </div>
            <div className="nav-right">
                <span className="user-pill">User Details</span>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.75rem 1rem",
        background: "#fff",
        borderBottom: "1px solid #eee",
    },
    brand: {
        fontWeight: 700,
    },
    links: {
        display: "flex",
        gap: "1rem",
    },
};
