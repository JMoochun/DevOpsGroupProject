import React, { useState } from "react";
import ProductModal from "../components/ProductModal"; // Import product modal component

export default function Inventory() {

    // Controls whether the product modal is visible
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Tracks whether the modal is used for creating or editing a product
    const [modalMode, setModalMode] = useState("create");

    // Holds the product currently being edited
    const [selectedProduct, setSelectedProduct] = useState(null);

    // TEMPORARY: product list until backend is added, used for testing
    const [products, setProducts] = useState([
        { id: 1, name: "Camera A", sku: "CAM-001", category: "Camera",      quantity: 5,  price: 200 },
        { id: 2, name: "Tripod B", sku: "TRI-002", category: "Accessories", quantity: 12, price: 39 }
    ]);

    // Opens the modal in "create" mode for adding a new product
    const openCreate = () => {
        setModalMode("create");      // Set mode to create
        setSelectedProduct(null);    // Clear any previously selected product
        setIsModalOpen(true);        // Show the modal
    };

    // Opens the modal in "edit" mode for updating an existing product
    const openEdit = (product) => {
        setModalMode("edit");        // Set mode to edit
        setSelectedProduct(product); // Store the product to be edited
        setIsModalOpen(true);        // Show the modal
    };

    // Handles the data submitted from the ProductModal component
    const handleSubmit = (data) => {

            if (modalMode === "create") {

                // Make a new product object
                const newProduct = {
                    id: Date.now(),             // Date.now() - creates a quick unique id for testing
                    ...data                     // Include all the form fields (name, sku, etc.)
                };

                // Add the new product to the end of the product list
                setProducts(previousProducts => [
                    ...previousProducts,        // Keep everything that was already in the list
                    newProduct                  // Then add the new product at the end
                ]);
            } 
            else {

            // If editing an existing product, update the product that matches the selected id
            setProducts(previousProducts =>
                previousProducts.map(product => {

                    // Check if this is the product we want to update
                    if (product.id === selectedProduct.id) {

                        // Return a new object with the updated form values
                        return {
                            ...product,   // keep the original fields
                            ...data       // replace with the new edited values
                        };
                    }

                    // If it is not the product we are editing, keep it the same
                    return product;
                })
            );
        }
    };

    return (
        <div className="page">

            {/* Main title for the Inventory page */}
            <h1 className="page-title">Inventory Management</h1>

            {/* Subtitle from original file describing future CRUD operations */}
            <p className="page-subtitle"> IMS page. CRUD operations area. Add any description for our page </p>

            {/* Button to open the Add Product modal */}
            <div className="add-product-container">
                <button className="primary-btn add-product-btn" onClick={openCreate}> + Add Product </button>
            </div>

            {/* Card that contains the product section */}
            <div className="card" style={{ marginTop: "20px" }}>

                {/* Card title for products */}
                <h2 className="card-title">Products</h2>

                {/* Original placeholder text kept for context */}
                <p className="muted">Table of products will go here.</p>

                {/* Actual products table appears below the placeholder line */}
                <table className="product-table" style={{ marginTop: "15px" }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Loop through products and render each as a table row */}
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.sku}</td>
                                <td>{p.category}</td>
                                <td>{p.quantity}</td>
                                <td>${p.price}</td>
     
                                <td style={{ display: "flex", gap: "8px" }}>
                                    {/* Edit button to open modal with this product's data */}
                                    <button
                                        className="secondary-btn"
                                        onClick={() => openEdit(p)}
                                    >
                                        Edit
                                    </button>

                                    {/* Remove button placeholder (Mutaz Task) */}
                                    <button
                                        className="danger-btn"
                                        onClick={() => console.log("Remove placeholder")}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Product modal component used for both Create and Edit */}
            <ProductModal
                isOpen={isModalOpen}                    // Controls modal visibility
                mode={modalMode}                        // "create" or "edit"
                initialData={selectedProduct}           // Product data when editing
                onClose={() => setIsModalOpen(false)}   // Function to close the modal
                onSubmit={handleSubmit}                 // Handle data from the modal
            />

        </div>
    );
}
