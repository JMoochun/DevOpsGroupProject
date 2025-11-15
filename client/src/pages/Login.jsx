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

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic client-side validation (Justine will enhance this)
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
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

        <form onSubmit={handleSubmit} className="auth-form">
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
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
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
              required
            />
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
