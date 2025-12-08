import React, { useEffect, useState } from "react";
import axios from "axios"; 
import "../components/ProfileModal.css";
import NotificationPreferences from "./NotificationPreferences";
export default function ProfileModal({ isOpen, onClose }) {

    // Holds all user-editable profile fields
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});   // Holds field-specific errors (ex: invalid email)
    const [generalError, setGeneralError] = useState(""); // Holds a general error message for save failures
    const [isSaving, setIsSaving] = useState(false);      // Tracks whether the "Save changes" button is processing

    // Load user from localStorage whenever modal opens
    useEffect(() => {
        if (!isOpen) return;    // Do nothing if modal is closed

        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

        // Pre-fill input fields using stored user values
        setFormData({
            firstName: storedUser.firstName || "",
            lastName: storedUser.lastName || "",
            email: storedUser.email || "",
            role: storedUser.role || "employee",
        });

        // Reset all errors whenever modal opens
        setFieldErrors({});
        setGeneralError("");
    }, [isOpen]);

    // Do not render anything if modal is closed
    if (!isOpen) return null;

    // Validate user input fields before saving
    const validate = (data) => {
        const errors = {};
        const trimmedFirstName = data.firstName.trim();
        const trimmedLastName = data.lastName.trim();
        const trimmedEmail = data.email.trim();

        // Same email regex pattern used in Register.jsx
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // First name validation
        if (!trimmedFirstName) {
            errors.firstName = "First name is required.";
        } else if (trimmedFirstName.length < 2) {
            errors.firstName = "First name must be at least 2 characters";
        } else if (!/^[A-Za-z\s]+$/.test(trimmedFirstName)) {
            errors.firstName = "First name may only contain letters and spaces";
        }

        // Last name validation
        if (!trimmedLastName) {
            errors.lastName = "Last name is required.";
        } else if (trimmedLastName.length < 2) {
            errors.lastName = "Last name must be at least 2 characters";
        } else if (!/^[A-Za-z\s]+$/.test(trimmedLastName)) {
            errors.lastName = "Last name may only contain letters and spaces";
        }

        // Email validation
        if (!trimmedEmail) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(trimmedEmail)) {
            errors.email = "Please enter a valid email address";
        }

        return errors;  // Return object containing all validation errors
    };

    // Update formData whenever the user types in any input field
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({...prev, [name]: value, }));
        setFieldErrors((prev) => ({...prev, [name]: "", }));    // Clear the error for the field being edited
        setGeneralError("");                                    // Clear general error on new input
    };

    // Handle Save button inside the modal
    const handleSubmit = async (e) => {
        e.preventDefault();     // Prevent page refresh
        setGeneralError("");    // Clear general error before validation

        const errors = validate(formData);      // Validate fields
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);                 // Show field error messages
            return;
        }

        try {
            setIsSaving(true);  // Disable buttons during save
            
            const token = localStorage.getItem("token");    // Get JWT token from localStorage

            // Call backend to update the logged-in user's profile
            const response = await axios.put(
                "http://localhost:5000/api/users/me",
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Backend returns: { message: "Profile updated successfully", user: { ... } }
            const updatedUser = response.data.user;

            // Keep localStorage in sync with backend result
            if (updatedUser) {
                localStorage.setItem("user", JSON.stringify(updatedUser));
            }

            onClose(); // Close modal after successful save
        } catch (err) {
            console.error("Failed to update profile:", err);
            const message =
                err.response?.data?.message ||
                "Failed to save changes. Please try again.";
            setGeneralError(message);   // Show error at top of form
        } finally {
            setIsSaving(false); // Re-enable buttons after save attempt
        }
    };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
        <div className="profile-modal-box" onClick={(e) => e.stopPropagation()}> 

            {/* Header section of the modal*/}
            <div className="profile-modal-header">
                <h2>Account Details</h2>
                <button type="button" className="profile-modal-close-btn" onClick={onClose}>
                    ×
                </button>
            </div>

            {/* Form with all the user's fields*/}
            <form className="profile-modal-form" onSubmit={handleSubmit}>

                {/* General error displayed at top of form */}
                {generalError && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <div>{generalError}</div>
                    </div>
                )}

                {/* First name + last name input grid */}
                <div className="profile-modal-grid">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={fieldErrors.firstName ? "input-error" : ""}
                        />
                        {fieldErrors.firstName && (
                            <p className="field-error">{fieldErrors.firstName}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={fieldErrors.lastName ? "input-error" : ""}
                        />
                        {fieldErrors.lastName && (
                            <p className="field-error">{fieldErrors.lastName}</p>
                        )}
                    </div>
                </div>

                {/* Email field */}
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldErrors.email ? "input-error" : ""}
                    />
                    {fieldErrors.email && (
                    <p className="field-error">{fieldErrors.email}</p>
                    )}
                </div>

                   {/* NOTIFICATION SETTINGS */}
                <div className="profile-section">
                    <h3>Notification Settings</h3>
                    <NotificationPreferences compact={true} />
                </div>


                {/* Read-only Role (employees cannot edit role) */}
                <div className="profile-info-row">
                    <div className="profile-info-item">
                        <span className="profile-info-label">Role </span>
                        <span className="profile-info-value">
                            {formData.role || "employee"}
                        </span>
                    </div>
                </div>

                {/* Bottom buttons */}
                <div className="profile-modal-actions">
                    <button type="button"
                    className="profile-modal-secondary-btn"
                    onClick={onClose}
                    disabled={isSaving}
                    >
                    Cancel
                    </button>

                    <button
                    type="submit"
                    className="btn-add-product"
                    disabled={isSaving}
                    >
                    {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
}
