import React from "react";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationBadge() {
    const { unreadCount } = useNotifications();

    if (!unreadCount) {
        return null;
    }

    return <span className="notification-badge">{unreadCount}</span>;
}
