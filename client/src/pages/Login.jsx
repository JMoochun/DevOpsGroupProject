import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Auth.css';

/**
 * LOGIN COMPONENT
 * Purpose: Authenticate users and redirect to dashboard
 * User Story: IMS-01 - Employee can log into the application
 * 
 * Features:
 * - Email and password input fields
 * - Client-side validation (handled by Justine's task)
 * - Error message display
 * - Link to registration and forgot password
 */

const Login = () => {
    const navigate = useNavigate();

    // State management for form inputs and feedback
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    // Justine: Validates the email and password fields
    const validateFields = (data) => {
        const errors = {};

        if (!data.email.trim()) {
            errors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            errors.email = "Invalid email format";
        }

        if (!data.password.trim()) {
            errors.password = "Password is required";
        } else if (data.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        return errors;
    };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setFieldErrors({
            ...fieldErrors,
            [e.target.name]: ""
        });

        setError(''); // Clear error when user types
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        const errors = validateFields(formData);
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setLoading(false);
            return;
        }

        try {
            // API call to backend (David S will create this endpoint)
            const response = await axios.post('http://localhost:5000/api/auth/login', formData);

            // Store JWT token (David S's task)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect to dashboard
            navigate('/home');
        } catch (err) {
            // Display error from server (David C's error handling)
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Inventory Management System</h1>
                    <h2>Login</h2>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    {/* Error Message Display */}
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                        {fieldErrors.email && (
                            <p className="field-error">{fieldErrors.email}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                        {fieldErrors.password && (
                            <p className="field-error">{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Forgot Password Link (Mutaz's task) */}
                    <div className="form-links">
                        <Link to="/forgot-password" className="link">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Register Link (Jeremiah's task - see below) */}
                    <div className="form-footer">
                        <p>Don't have an account?</p>
                        <Link to="/register" className="link-primary">
                            Register Here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
