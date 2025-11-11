import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/auth/register", form);
            // after register, go to login
            navigate("/");
        } catch (err) {
            setError("Register won't work (no backend yet).");
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <h1>Create account</h1>
                {error && <div className="error-box">{error}</div>}
                <form onSubmit={submit} className="auth-form">
                    <label>First name</label>
                    <input
                        value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        required
                    />
                    <label>Last name</label>
                    <input
                        value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        required
                    />
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
                    <button type="submit">Register</button>
                </form>
                <div className="auth-links">
                    <Link to="/">Already have an account?</Link>
                </div>
            </div>
        </div>
    );
}
