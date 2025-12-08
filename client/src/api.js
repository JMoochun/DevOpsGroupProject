import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, 
});

// ==================== AUTH & USER API ====================

export const register = async (userData) => {
    const response = await api.post("/signup", userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post("/login", credentials);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post("/reset-password", { token, newPassword });
    return response.data;
};

/**
 * Fetch current user profile (includes mutedCategories)
 */
export const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    const response = await api.put(
        "/users/me",
        {
            firstName: storedUser.firstName || "",
            lastName: storedUser.lastName || "",
            email: storedUser.email || ""
        },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data.user;
};

/**
 * Update current user profile
 */
export const updateUserProfile = async (profileData) => {
    const token = localStorage.getItem("token");
    const response = await api.put(
        "/users/me",
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.user;
};

/**
 * Update notification preference for a category
 * FIXED: Correct path /users/notifications/preferences
 */
export const updateNotificationPreference = async (category, action) => {
    const token = localStorage.getItem("token");
    
    const response = await api.put(
        "/users/notifications/preferences",  // <-- FIXED: Added /users prefix
        { category, action },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data.mutedCategories;
};

export default api;