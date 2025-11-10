import React from "react";

export default function Notifications() {
    return (
        <div className="page">
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">If we don't want the page like this we can adjust</p>

            <div className="card">
                <h2 className="card-title">Recent notifications</h2>
                <p className="muted">You have no notifications</p>
            </div>
        </div>
    );
}
