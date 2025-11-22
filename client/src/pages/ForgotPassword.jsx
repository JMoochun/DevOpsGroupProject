import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Auth.css';

/**
 * FORGOT PASSWORD COMPONENT
 * Purpose: Request password reset email
 * User Story: IMS-03 - Employee can reset password if forgotten
 * 
 * Features:
 * - Email input for reset request
 * - Sends reset token via email (Aiko's task - backend)
 * - Validation (Justine's task)
 * - User existence check (Mutaz's task - backend)
 */

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

      // Basic validation (Justine will enhance)
      const validateEmail = (value) => {
          if (!value.trim()) return "Please enter your email address";

          const trimmed = value.trim();
          const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

          if (!emailRegex.test(trimmed)) return "Please enter a valid email address";

          return "";
      };

      const errorMsg = validateEmail(email);
      if (errorMsg) {
          setError(errorMsg);
          return;
      }

    setLoading(true);

    try {
      // API call to request password reset (David S & Aiko's work)
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      
      setSuccess(response.data.message || 'Password reset link sent to your email!');
      setEmail(''); // Clear input
    } catch (err) {
      // Handle user not found (Mutaz's validation)
      if (err.response?.status === 404) {
        setError('No account found with this email. Would you like to register?');
      } else {
        setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
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
          <h2>Forgot Password</h2>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
            Enter your email to receive a password reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <div>
                {error}
                {error.includes('register') && (
                  <div style={{ marginTop: '8px' }}>
                    <Link to="/register" className="link">
                      Register here
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <span className="error-icon">✓</span>
              {success}
            </div>
          )}

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
                setSuccess('');
              }}
              placeholder="Enter your registered email"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {/* Back to Login Link */}
          <div className="form-footer">
            <p>Remember your password?</p>
            <Link to="/" className="link-primary">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
