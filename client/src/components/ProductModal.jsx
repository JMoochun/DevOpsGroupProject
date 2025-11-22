import React, { useState, useEffect } from "react";
import "../ProductModal.css";

export default function ProductModal({
    isOpen,
    mode = "create",
    initialData,
    onClose,
    onSubmit
}) {
    const [formData, setFormData] = useState({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        costPrice: 0,
        salePrice: 0
    });

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

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: ["quantity", "costPrice", "salePrice"].includes(name)
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="product-modal-overlay" onClick={onClose}>
            <div
                className="product-modal-box"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="product-modal-header">
                    <h2>{mode === "edit" ? "Update Product" : "Add Product"}</h2>
                    <button className="product-modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

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

                    <div className="product-modal-actions">
                        <button
                            type="button"
                            className="product-modal-secondary-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button type="submit" className="product-modal-primary-btn">
                            {mode === "edit" ? "Save Changes" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
