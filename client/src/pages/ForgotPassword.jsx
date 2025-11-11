import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        // DS - will implement call to the forgot password backend here. I assume mail service backend call might be applicable here.
        setSent(true);
    };

    return (
        <div className="auth-shell">
            <div className="auth-card">
                <h1>Forgot password</h1>
                {!sent ? (
                    <>
                        <p className="muted">Enter your email to receive reset instructions.</p>
                        <form onSubmit={submit} className="auth-form">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Send reset link</button>
                        </form>
                    </>
                ) : (
                    <p>Check your email for reset instructions (placeholder).</p>
                )}
                <div className="auth-links">
                    <Link to="/">Back to login</Link>
                </div>
            </div>
        </div>
    );
}
