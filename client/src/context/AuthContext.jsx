import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const stored = JSON.parse(localStorage.getItem('user') || 'null');
            setUser(stored ? { ...payload, ...stored } : payload);
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, []);

    const login = (token, profile) => {
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (profile) {
            localStorage.setItem('user', JSON.stringify(profile));
            setUser({ ...payload, ...profile });
        } else {
            setUser(payload);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);