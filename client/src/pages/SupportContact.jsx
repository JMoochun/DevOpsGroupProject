import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios'; // Uncomment this when you integrate with the backend API
import '../SupportContact.css'; // Don't forget to create this CSS file!

/**
 * SUPPORT CONTACT PAGE COMPONENT
 * Purpose: Display and (for IT Support) edit support contact information.
 * User Story: KAN-149 - UI page to display read-only support contact fields
 * User Story: KAN-150 - Ensure only IT Support employee can edit (role check)
 * User Story: KAN-151 - If IT employee: add UI form for editing fields
 * User Story: KAN-152 - Client-side validation (email, phone formats)
 * 
 * Features:
 * - Displays read-only support contact details.
 * - Checks user role to enable/disable editing.
 * - Provides an editable form for IT Support roles.
 * - Implements client-side validation for email and phone fields.
 */

const SupportContact = () => {
  // Mock data for initial display (replace with API call later)
  const [supportData, setSupportData] = useState({
    name: "IMS IT Support",
    email: "it@ims.support.com",
    phone: "+1 (800) 123-4567",
    hours: "Monday - Friday, 9 AM - 5 PM EST",
  });

  // State for the editable form fields
  const [editFormData, setEditFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Determine if the current user is an IT Support employee
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isITSupport = user.role === "IT Support"; // Assuming user.role will be "IT Support" for these employees

  // Function to fetch support contact data (to be integrated with backend KAN-148)
  useEffect(() => {
    const fetchSupportContact = async () => {
      setLoading(true);
      setError('');
      try {
        // const token = localStorage.getItem('token');
        // const response = await axios.get('http://localhost:5000/api/support-contact', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // setSupportData(response.data);
        // setEditFormData(response.data); // Initialize form data with fetched data

        // --- MOCKING DATA FOR NOW ---
        setSupportData(mockSupportContact);
        setEditFormData(mockSupportContact);
        // --- END MOCKING ---

      } catch (err) {
        setError('Failed to load support contact information.');
        console.error('Error fetching support contact:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupportContact();
  }, []);

  // Client-side validation function (KAN-152)
  const validateFields = (data) => {
    const errors = {};
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    // Basic phone number validation (e.g., xxx-xxx-xxxx or (xxx) xxx-xxxx)
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

    if (!data.name.trim()) {
      errors.name = "Name is required";
    }
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email format";
    }
    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(data.phone)) {
      errors.phone = "Invalid phone number format (e.g., 123-456-7890)";
    }
    if (!data.hours.trim()) {
      errors.hours = "Hours are required";
    }
    return errors;
  };

  // Handle input changes for the edit form
  const handleChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: "" // Clear error when user types
    });
    setError(''); // Clear general error message
    setSuccess(''); // Clear success message
  };

  // Handle form submission for editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setFieldErrors({});

    const errors = validateFields(editFormData);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      // API call to update support contact (David S will create this endpoint)
      // const token = localStorage.getItem('token');
      // await axios.put('http://localhost:5000/api/support-contact', editFormData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // --- MOCKING DATA UPDATE FOR NOW ---
      setSupportData(editFormData); // Update displayed data with new form data
      setSuccess('Support contact updated successfully!');
      // --- END MOCKING ---

      setIsEditing(false); // Exit editing mode
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update support contact. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mock Support Contact Data (will be replaced by API call)
  const mockSupportContact = {
    name: "IMS IT Support",
    email: "it@ims.support.com",
    phone: "+1 (800) 123-4567",
    hours: "Monday - Friday, 9 AM - 5 PM EST",
  };

  if (loading && !isEditing) {
    return <div className="support-contact-container">Loading support contact info...</div>;
  }

  return (
    <div className="support-contact-container">
      <div className="support-contact-card">
        <div className="support-contact-header">
          <h1>Support Contact</h1>
          <h2>Having some trouble? Let us know.</h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <span className="error-icon">✓</span>
            {success}
          </div>
        )}

        {isEditing && isITSupport ? ( // KAN-151: If IT employee, add UI form for editing
          <form onSubmit={handleSubmit} className="support-contact-form">
            <div className="form-group">
              <label htmlFor="name">Contact Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editFormData.name || ''}
                onChange={handleChange}
                className={fieldErrors.name ? 'input-error' : ''}
                disabled={loading}
              />
              {fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editFormData.email || ''}
                onChange={handleChange}
                className={fieldErrors.email ? 'input-error' : ''}
                disabled={loading}
              />
              {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={editFormData.phone || ''}
                onChange={handleChange}
                className={fieldErrors.phone ? 'input-error' : ''}
                disabled={loading}
              />
              {fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="hours">Operating Hours</label>
              <input
                type="text"
                id="hours"
                name="hours"
                value={editFormData.hours || ''}
                onChange={handleChange}
                className={fieldErrors.hours ? 'input-error' : ''}
                disabled={loading}
              />
              {fieldErrors.hours && <p className="field-error">{fieldErrors.hours}</p>}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => {
                setIsEditing(false);
                setEditFormData(supportData); // Revert changes if cancelled
                setError('');
                setSuccess('');
                setFieldErrors({});
              }} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        ) : ( // KAN-149: UI page to display read-only support contact fields
          <div className="support-contact-details">
            <div className="detail-item">
              <strong>Name:</strong> <span>{supportData.name}</span>
            </div>
            <div className="detail-item">
              <strong>Email:</strong> <span>{supportData.email}</span>
            </div>
            <div className="detail-item">
              <strong>Phone:</strong> <span>{supportData.phone}</span>
            </div>
            <div className="detail-item">
              <strong>Hours:</strong> <span>{supportData.hours}</span>
            </div>

            {isITSupport && ( // KAN-150: Ensure only IT Support employee can edit
              <div className="form-actions">
                <button className="btn-primary" onClick={() => {
                  setIsEditing(true);
                  setError('');
                  setSuccess('');
                }}>
                  Edit Contact Info
                </button>
              </div>
            )}
          </div>
        )}

        <div className="form-footer">
          <Link to="/home" className="link-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportContact;