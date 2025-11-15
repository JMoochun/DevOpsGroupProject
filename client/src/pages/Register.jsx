import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../Auth.css';

/**
 * REGISTER COMPONENT
 * Purpose: Allow new employees to create accounts
 * User Story: IMS-02 - Employee can register a new account
 * 
 * Features:
 * - Name, Email, Password, Role input fields
 * - Client-side validation (Justine's task)
 * - Password hashing (Davi's task - backend)
 * - Duplicate email check (David C's task - backend)
 * - Link back to login
 */

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Employee' // Default role
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Available user roles (as per project requirements)
  const roles = ['Employee', 'Manager', 'Accountant', 'IT Support'];

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear specific field error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setServerError('');
  };

  // Client-side validation (Justine will enhance this)
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // API call to backend (David S will create endpoint, Davi handles hashing)
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      // Show success and redirect to login
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      // Handle duplicate email error (David C's task)
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
          {/* Server Error Message */}
          {serverError && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {serverError}
            </div>
          )}

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
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
            {errors.email && <span className="field-error">{errors.email}</span>}
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
            {errors.password && <span className="field-error">{errors.password}</span>}
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
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
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
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          {/* Login Link */}
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
