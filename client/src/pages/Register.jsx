import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';
import api from '../api';

/** * REGISTER COMPONENT * 
 * Purpose: Allow new employees to create accounts 
 * * User Story: IMS-02 - Employee can register a new account *
 *  * Features: * - Name, Email, Password, Role input fields 
 * * - Client-side validation (Justine's task) 
 * * - Password hashing (Davi's task - backend) 
 * * - Duplicate email check (David C's task - backend) 
 * * - Link back to login */

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee', // default matches backend enum
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    // Use value/label so value matches backend enum
    const roles = [
        { value: 'employee', label: 'Employee' },
        { value: 'manager', label: 'Manager' },
        { value: 'accountant', label: 'Accountant' },
        { value: 'it_support', label: 'IT Support' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
        setServerError('');
    };

    const validateForm = () => {
        const newErrors = {};

        const trimmedFirstName = formData.firstName.trim();
        const trimmedLastName = formData.lastName.trim();
        const trimmedEmail = formData.email.trim();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        // First name validation
        if (!trimmedFirstName) {
            newErrors.firstName = 'First name is required.';
        } else if (trimmedFirstName.length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        } else if (!/^[A-Za-z\s]+$/.test(trimmedFirstName)) {
            newErrors.firstName = 'First name may only contain letters and spaces';
        }

        // Last name validation
        if (!trimmedLastName) {
            newErrors.lastName = 'Last name is required.';
        } else if (trimmedLastName.length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        } else if (!/^[A-Za-z\s]+$/.test(trimmedLastName)) {
            newErrors.lastName = 'Last name may only contain letters and spaces';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(trimmedEmail)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordErrors = [];

            if (password.length < 6) {
                passwordErrors.push('* Must be at least 6 characters');
            }
            if (!/[A-Z]/.test(password)) {
                passwordErrors.push('* Must contain at least 1 uppercase letter');
            }
            if (!/[a-z]/.test(password)) {
                passwordErrors.push('* Must contain at least 1 lowercase letter');
            }
            if (!/\d/.test(password)) {
                passwordErrors.push('* Must contain at least 1 number');
            }
            if (!/[!@#$%^&*]/.test(password)) {
                passwordErrors.push('* Must contain at least 1 special character (!@#$%^&*)');
            }
            if (passwordErrors.length > 0) {
                newErrors.password = passwordErrors.join('\n');
            }
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        // Role validation (use enum values)
        const allowedRoles = ['employee', 'manager', 'accountant', 'it_support'];
        if (!allowedRoles.includes(formData.role)) {
            newErrors.role = 'Invalid role selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const trimmedData = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            password: formData.password.trim(),
            role: formData.role, // enum value
        };

        try {
            const _response = await api.post('/auth/register', trimmedData);
            alert('Registration successful! Please login.');
            navigate('/');
        } catch (err) {
            if (err.response?.data?.message) {
                setServerError(err.response.data.message);
            } else {
                setServerError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Inventory Management System</h1>
                    <h2>Create Account</h2>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {serverError && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {serverError}
                        </div>
                    )}

                    {/* First Name Input */}
                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            className={errors.firstName ? 'input-error' : ''}
                        />
                        {errors.firstName && (
                            <span className="field-error">{errors.firstName}</span>
                        )}
                    </div>

                    {/* Last Name Input */}
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            className={errors.lastName ? 'input-error' : ''}
                        />
                        {errors.lastName && (
                            <span className="field-error">{errors.lastName}</span>
                        )}
                    </div>

                    {/* Email Input */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && (
                            <span className="field-error">{errors.email}</span>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label htmlFor="password">Password *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && (
                            <div
                                className="field-error"
                                style={{ whiteSpace: 'pre-line' }}
                            >
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            className={errors.confirmPassword ? 'input-error' : ''}
                        />
                        {errors.confirmPassword && (
                            <span className="field-error">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Role Selection */}
                    <div className="form-group">
                        <label htmlFor="role">Role *</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={errors.role ? 'input-error' : ''}
                        >
                            {roles.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <span className="field-error">{errors.role}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>

                    <div className="form-footer">
                        <p>Already have an account?</p>
                        <Link to="/" className="link-primary">
                            Login Here
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
