import React, { useState, useEffect } from "react";
import { updateNotificationPreference } from "../api";
import "./NotificationPreferences.css";

const NOTIFICATION_CATEGORIES = [
    { id: "system_updates", label: "System Updates", desc: "Maintenance and system alerts" },
    { id: "security", label: "Security", desc: "Password and login notifications" },
    { id: "new_features", label: "New Features", desc: "Announcements about new features" },
    { id: "marketing", label: "Marketing", desc: "Tips, news, and promotional content" }
];

export default function NotificationPreferences({ compact = false }) {
    const [mutedCategories, setMutedCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);

    useEffect(() => {
        // Load from localStorage like ProfileModal does
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setMutedCategories(storedUser.mutedCategories || []);
        setLoading(false);
    }, []);

    const toggleCategory = async (categoryId) => {
        const isMuted = mutedCategories.includes(categoryId);
        const action = isMuted ? "unmute" : "mute";
        
        setSaving(categoryId);

        // Optimistic update
        const updatedCategories = isMuted 
            ? mutedCategories.filter(c => c !== categoryId)
            : [...mutedCategories, categoryId];
        
        setMutedCategories(updatedCategories);

        try {
            // Save to backend
            const result = await updateNotificationPreference(categoryId, action);
            
            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            storedUser.mutedCategories = result;
            localStorage.setItem("user", JSON.stringify(storedUser));
        } catch (err) {
            // Revert on error
            setMutedCategories(mutedCategories);
            alert("Failed to save preference. Please try again.");
            console.error("Update error:", err);
        } finally {
            setSaving(null);
        }
    };

    if (loading && !compact) return <div className="preferences-loading">Loading preferences...</div>;

    return (
        <div className={`notification-preferences ${compact ? "compact" : ""}`}>
            {!compact && <h2>Notification Preferences</h2>}
            
            <div className="category-list">
                {NOTIFICATION_CATEGORIES.map(category => {
                    const isMuted = mutedCategories.includes(category.id);
                    const isSaving = saving === category.id;

                    return (
                        <div key={category.id} className="category-item">
                            <div className="category-info">
                                <h4>{category.label}</h4>
                                <p>{category.desc}</p>
                            </div>
                            
                            <button
                                onClick={() => toggleCategory(category.id)}
                                disabled={isSaving}
                                className={`toggle-switch ${isMuted ? 'muted' : 'active'}`}
                                style={{ cursor: isSaving ? 'not-allowed' : 'pointer' }}
                            >
                                <span className="toggle-slider"></span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {!compact && (
                <div className="preferences-footer">
                    <small>Toggles save automatically when clicked</small>
                </div>
            )}
        </div>
    );
}