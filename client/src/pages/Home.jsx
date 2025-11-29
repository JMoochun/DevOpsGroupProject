import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="page">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">We can add whatever we want here. First we need to decide what goes on the homepage</p>

            <div className="grid-2">
                <div className="card">
                    <h2 className="card-title">Example Card (maybe products recently added)</h2>
                    <p className="muted">example text.</p>
                </div>
                <div className="card">
                    <h2 className="card-title">Example Card (low stock?)</h2>
                    <p className="muted">example text.</p>
                </div>
            </div>
        {/* Add the link to Support Contact in the footer */}
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Link to="/support" className="nav-link" style={{ color: '#667eea', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Support Contact
                </Link>
            </div>
        
        </div>

    );
}
