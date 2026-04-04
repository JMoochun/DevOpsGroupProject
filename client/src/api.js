import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==================== AUTH & USER API ====================

export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, password) => {
    const response = await api.post("/auth/reset-password", { token, password });
    return response.data;
};

/**
 * Fetch current user profile (includes mutedCategories)
 */
export const fetchCurrentUser = async () => {
    const response = await api.get("/users/me");
    return response.data.user;
};

/**
 * Update current user profile
 */
export const updateUserProfile = async (profileData) => {
    const response = await api.put("/users/me", profileData);
    return response.data.user;
};

/**
 * Update notification preference for a category
 */
export const updateNotificationPreference = async (category, action) => {
    const response = await api.put("/users/notifications/preferences", {
        category,
        action,
    });
    return response.data.mutedCategories;
};

export default api;
