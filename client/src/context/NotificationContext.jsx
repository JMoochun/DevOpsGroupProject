import React, { createContext, useContext, useState, useMemo } from "react";

const NotificationContext = createContext(null);

const initialNotifications = [
    {
        id: "1",
        type: "LOW_STOCK",
        title: "Low stock: Widget A",
        message: "Only 5 units remaining in Main Branch.",
        createdAt: new Date().toISOString(),
        read: false,
    },
    {
        id: "2",
        type: "PRODUCT_UPDATE",
        title: "Product updated: Widget B",
        message: "Price updated from $10 to $11.",
        createdAt: new Date().toISOString(),
        read: false,
    },
    {
        id: "3",
        type: "LOW_STOCK",
        title: "Low stock: Widget C",
        message: "Only 2 units remaining.",
        createdAt: new Date().toISOString(),
        read: true,
    },
];

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(initialNotifications);

    const addFakeNotification = (type = "LOW_STOCK") => {
        const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        const title =
            type === "LOW_STOCK"
                ? "Low stock: Example product"
                : "Product updated: Example product";

        setNotifications((prev) => [
            {
                id,
                type,
                title,
                message:
                    type === "LOW_STOCK"
                        ? "Simulated low stock alert for testing."
                        : "Simulated product update notification for testing.",
                createdAt: new Date().toISOString(),
                read: false,
            },
            ...prev,
        ]);
    };

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const deleteNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const deleteMany = (ids) => {
        setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
    };

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const value = {
        notifications,
        unreadCount,
        addFakeNotification,
        markAsRead,
        deleteNotification,
        deleteMany,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
