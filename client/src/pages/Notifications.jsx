// client/src/pages/Notifications.jsx
import React, { useMemo, useState } from "react";
import "./Notifications.css";
import { useNotifications } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
    const { notifications, markAsRead, deleteNotification, deleteMany } =
        useNotifications();
    const { user } = useAuth();

    // Filter: default to the main thing each role cares about
    const [filter, setFilter] = useState(
        user?.role === "manager" ? "LOW_STOCK" : "STOCK_UPDATE"
    );

    const [selectedIds, setSelectedIds] = useState([]);

    const filteredNotifications = useMemo(
        () =>
            notifications.filter((n) =>
                filter === "ALL" ? true : n.type === filter
            ),
        [notifications, filter]
    );

    const isAllSelected =
        filteredNotifications.length > 0 &&
        filteredNotifications.every((n) => selectedIds.includes(n._id));

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredNotifications.map((n) => n._id));
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        
        if (selectedIds.length === 1) {
            deleteNotification(selectedIds[0])
        }else{
            deleteMany(selectedIds);
        }
        setSelectedIds([]);
    };

    const handleOpen = (id) => {
        // UI-only "open": mark as read and maybe later show a modal
        markAsRead(id);
    };

    const roleLabel =
        user?.role === "manager" ? "Low stock alerts" : "Product update notifications";

    return (
        <div className="page notifications-page">
            <div className="notifications-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">
                        {roleLabel} � open to mark as read, or delete individually / in bulk.
                    </p>
                </div>
            </div>

            <div className="card">
                <div className="notifications-toolbar">
                    <div className="filters">
                        <button
                            type="button"
                            className={
                                "chip" + (filter === "ALL" ? " chip-active" : "")
                            }
                            onClick={() => setFilter("ALL")}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            className={
                                "chip" +
                                (filter === "LOW_STOCK" ? " chip-active" : "")
                            }
                            onClick={() => setFilter("LOW_STOCK")}
                        >
                            Low stock
                        </button>
                        <button
                            type="button"
                            className={
                                "chip" +
                                (filter === "STOCK_UPDATE" ? " chip-active" : "")
                            }
                            onClick={() => setFilter("STOCK_UPDATE")}
                        >
                            Product updates
                        </button>
                    </div>

                    <button
                        type="button"
                        className="btn danger-btn"
                        disabled={selectedIds.length === 0}
                        onClick={handleBulkDelete}
                    >
                        Delete selected
                    </button>
                </div>

                {filteredNotifications.length === 0 ? (
                    <p className="muted">You have no notifications for this filter.</p>
                ) : (
                    <table className="notifications-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th>Title</th>
                                <th>Message</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredNotifications.map((n) => (
                                <tr
                                    key={n._id}
                                    className={n.read ? "row-read" : "row-unread"}
                                >
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(n._id)}
                                            onChange={() => toggleSelectOne(n._id)}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="link-button"
                                            onClick={() => handleOpen(n._id)}
                                        >
                                            {n.title}
                                        </button>
                                    </td>
                                    <td>{n.message}</td>
                                    <td>
                                        {new Date(n.createdAt).toLocaleString()}
                                    </td>
                                    <td>
                                        {n.read ? (
                                            <span className="status-pill status-read">
                                                Read
                                            </span>
                                        ) : (
                                            <span className="status-pill status-unread">
                                                Unread
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn icon-btn"
                                            onClick={() => deleteNotification(n._id)}
                                        >
                                            x
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
