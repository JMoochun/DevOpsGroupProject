import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if(!user) return; 
        refreshNotifications();
    }, [user]);

    const refreshNotifications = async () => {
        try{
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/notifications", 
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setNotifications(res.data);
            } catch (err) {
                console.error("Failed to refresh notifications", err);
            }
    };

    const markAsRead = async (id) => {
        try{
            const token = localStorage.getItem("token");

            await axios.patch(`http://localhost:5000/api/notifications/${id}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, read: true } : n))
            );
        }catch(err){
            console.error("Error marking as read.", err);
        }
    };

    const deleteNotification = async (id) => {
         try{
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:5000/api/notifications/${id}`,
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            setNotifications((prev) => prev.filter((n) => n._id !== id));
         }catch(err){
            console.error("Error deleting notifications:", err);
         }
    };

    const deleteMany = async (ids) => { 
        try{
            const token = localStorage.getItem("token");

            await axios.post(`http://localhost:5000/api/notifications/bulk-delete`, {ids},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setNotifications((prev) => prev.filter((n) => !ids.includes(n._id)));
        }catch(err){
            console.error("Error deleting many: ", err);
        }
    };

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    const value = {
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        deleteMany,
        refreshNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
