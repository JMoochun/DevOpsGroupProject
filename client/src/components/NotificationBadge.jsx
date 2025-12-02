import React from "react";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationBadge() {
    const { unreadCount } = useNotifications();

    if (!unreadCount) {
        // No unread notifications – you can return null or a subtle dot if you prefer
        return null;
    }

    return <span className="notification-badge">{unreadCount}</span>;
}
