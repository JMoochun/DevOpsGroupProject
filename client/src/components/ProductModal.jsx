import React, { useState, useEffect } from "react";
import "../ProductModal.css"; // Import product modal's style

export default function ProductModal({
    isOpen,          // controls whether the modal should be visible
    mode = "create", // if modal is used to "create" or "edit"
    initialData,     // existing product data when editing
    onClose,         // function to close the modal
    onSubmit         // function that receives submitted form data
}) {

    // Local state for all modal input fields
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        quantity: "",
        price: ""
    });

    // Loads existing product data when editing OR resets fields when creating
    useEffect(() => {
        if (mode === "edit" && initialData) {
            // When editing, fill the form with the product's current values
            setFormData({
                name: initialData.name || "",
                sku: initialData.sku || "",
                category: initialData.category || "",
                quantity: initialData.quantity || "",
                price: initialData.price || ""
            });
        } else {
            // When creating a new product, reset all fields
            setFormData({
                name: "",
                sku: "",
                category: "",
                quantity: "",
                price: ""
            });
        }
    }, [mode, initialData, isOpen]);

    // If modal is closed, don't render anything
    if (!isOpen) return null;

    // Updates local formData when user types in any field
    const handleChange = (e) => {
        const { name, value } = e.target; // Get input's name (which field it is) and the value the user typed

        // Update only the one form field the user is typing in
        setFormData(previousValues => ({

            // Keep all the existing form fields the same
            ...previousValues,

            // Change the specific field the user edited (example: name, sku, price)
            [name]: value
        }));
    };

    // Handles the submit action inside the modal
    const handleSubmit = (e) => {
        e.preventDefault();       // Prevent page reload
        onSubmit(formData);       // Send data back up to Inventory.jsx
        onClose();                // Close modal after submission
    };

    return (
        // fullscreen dark background overlay
        <div className="product-modal-overlay" onClick={onClose}>

            {/* Center modal box */}
            
            <div
                className="product-modal-box"
                onClick={(e) => e.stopPropagation()}    /* stopPropagation stops the click from closing the modal */
            >

                {/* Header section of the modal */}
                <div className="product-modal-header">

                    {/* Show the correct title depending on mode */}
                    <h2>
                        {mode === "edit" ? "Update Product" : "Add Product"}
                    </h2>

                    {/* Button to close the modal */}
                    <button className="product-modal-close-btn" onClick={onClose}>×</button>
                </div>

                {/* Form with all product fields */}
                <form className="product-modal-form" onSubmit={handleSubmit}>

                    {/* Product Name */}
                    <label>Product Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    {/* SKU */}
                    <label>SKU</label>
                    <input
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                    />

                    {/* Category */}
                    <label>Category</label>
                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />

                    {/* Quantity */}
                    <label>Quantity</label>
                    <input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                    />

                    {/* Price */}
                    <label>Price</label>
                    <input
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                    />

                    {/* Bottom buttons */}
                    <div className="product-modal-actions">

                        {/* Cancel button */}
                        <button
                            type="button"
                            className="product-modal-secondary-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="product-modal-primary-btn"
                        >
                            {mode === "edit" ? "Save Changes" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
