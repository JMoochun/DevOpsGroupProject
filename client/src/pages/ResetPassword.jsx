import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../Auth.css';

/**
 * RESET PASSWORD COMPONENT
 * Purpose: Allow user to set new password using reset token
 * User Story: IMS-03 - Employee can reset password if forgotten
 * 
 * Features:
 * - Password and confirm password inputs
 * - Token validation from URL
 * - Password update (David S's backend task)
 * - Validation (Justine's task)
 */

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Get token from URL query parameter

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Check if token exists on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    setError('');
  };

  // Validate passwords (Justine will enhance)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // API call to reset password (David S's backend)
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        password: formData.password
      });

      setSuccess('Password reset successful! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Invalid or expired reset token. Please request a new one.');
      } else {
        setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Invalid Reset Link</h2>
          </div>
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            This password reset link is invalid or has expired.
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/forgot-password" className="link-primary">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Inventory Management System</h1>
          <h2>Reset Password</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <span className="error-icon">✓</span>
              {success}
            </div>
          )}

          {/* New Password Input */}
          <div className="form-group">
            <label htmlFor="password">New Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className={errors.password ? 'input-error' : ''}
              disabled={loading || success}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your new password"
              className={errors.confirmPassword ? 'input-error' : ''}
              disabled={loading || success}
            />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || success}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          {/* Back to Login Link */}
          <div className="form-footer">
            <Link to="/" className="link-primary">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
