import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const { data } = await api.post("/auth/login", form);
            // store token
            localStorage.setItem("token", data.token);
            navigate("/home");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <h1>Sign in</h1>
                <p className="muted">Access your inventory dashboard.</p>
                {error && <div className="error-box">{error}</div>}
                <form onSubmit={submit} className="auth-form">
                    <label>Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <div className="auth-links">
                    <Link to="/forgot-password">Forgot password?</Link>
                    <Link to="/register">Create an account</Link>
                </div>
            </div>
        </div>
    );
}
