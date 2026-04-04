import React, { useState, useEffect } from "react";
import "../components/ProductModal.css";
import "../Inventory.css";

export default function ProductModal({
    isOpen,
    mode = "create",
    initialData,
    onClose,
    onSubmit
}) {

    // Local state for all modal input fields
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        costPrice: 0,
        salePrice: 0
    });

    // Load existing product data when editing OR resets fields when creating
    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                name: initialData.name || "",
                sku: initialData.sku || "",
                category: initialData.category || "",
                quantity: initialData.quantity || 0,
                costPrice: initialData.costPrice || 0,
                salePrice: initialData.salePrice || 0
            });
        } else {
            setFormData({
                name: "",
                sku: "",
                category: "",
                quantity: 0,
                costPrice: 0,
                salePrice: 0
            });
        }
    }, [mode, initialData, isOpen]);

    // If modal is closed, don't render anything
    if (!isOpen) return null;

    // Updates local formData when user types in any field
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update only the one form field the user is typing in
        setFormData((prev) => ({
            ...prev,
            [name]: ["quantity", "costPrice", "salePrice"].includes(name)
                ? Number(value)
                : value
        }));
    };
    //client side validation for empty fields and valid numbers
    const validateForm = () => {
    if (!formData.name.trim()) return "Product name cannot be empty.";
    if (!formData.sku.trim()) return "SKU cannot be empty.";
    if (!formData.category.trim()) return "Category cannot be empty.";

    if (isNaN(formData.quantity) || formData.quantity < 0)
        return "Quantity must be a valid non-negative number.";

    if (isNaN(formData.costPrice) || formData.costPrice < 0)
        return "Cost price must be a valid non-negative number.";

    if (isNaN(formData.salePrice) || formData.salePrice < 0)
        return "Sale price must be a valid non-negative number.";

    return null; // no errors
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validateForm();
        if (err) {
            alert(err);
            return;
        }
        try {
            await Promise.resolve(onSubmit(formData));
        } catch {
            return;
        }
    };

    return (
        // fullscreen dark background overlay
        <div className="product-modal-overlay" onClick={onClose}>

            {/* Center modal box */}
            <div
                className="product-modal-box"
                onClick={(e) => e.stopPropagation()} /* stopPropagation stops the click from closing the modal */
            >
                {/* Header section of the modal */}
                <div className="product-modal-header">
                    <h2>{mode === "edit" ? "Update Product" : "Add Product"}</h2> 
                    <button className="product-modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                {/* Form with all product fields */}
                <form className="product-modal-form" onSubmit={handleSubmit}>
                    <label>Product Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required />

                    <label>SKU</label>
                    <input name="sku" value={formData.sku} onChange={handleChange} required />

                    <label>Category</label>
                    <input name="category" value={formData.category} onChange={handleChange} required />

                    <label>Quantity</label>
                    <input
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />

                    <label>Cost Price ($)</label>
                    <input
                        name="costPrice"
                        type="number"
                        step="0.01"
                        value={formData.costPrice}
                        onChange={handleChange}
                        required
                    />

                    <label>Sale Price ($)</label>
                    <input
                        name="salePrice"
                        type="number"
                        step="0.01"
                        value={formData.salePrice}
                        onChange={handleChange}
                        required
                    />

                    {/* Bottom buttons */}
                    <div className="product-modal-actions">
                        <button
                            type="button"
                            className="product-modal-secondary-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="btn-add-product">
                            {mode === "edit" ? "Save Changes" : "+ Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
