import { useState, useEffect } from "react";
import axios from "axios";
import ProductModal from "../components/ProductModal";
import "../Inventory.css";

export default function Inventory() {
  // =============================
  // STATE
  // =============================
  //const [products, setProducts] = useState([]);
  const [products, setProducts] = useState([
  {
    _id: "654321abcdef", // Unique ID for the product
    sku: "LAPTOP001",
    name: "SuperFast Laptop",
    category: "Electronics",
    quantity: 15,
    costPrice: 800.00,
    salePrice: 1200.00,
    revenue: 400.00,
  },
  {
    _id: "987654fedcba", // Another unique ID
    sku: "BOOK005",
    name: "React Mastery Guide",
    category: "Books",
    quantity: 5, // This one is low stock for testing the badge!
    costPrice: 15.00,
    salePrice: 25.00,
    revenue: 10.00,
  },
  {
    _id: "abcdef123456", // One more!
    sku: "MOU003",
    name: "Wireless Mouse",
    category: "Accessories",
    quantity: 30,
    costPrice: 10.00,
    salePrice: 20.00,
    revenue: 10.00,
  },
]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Role-based access
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  //const isManager = user.role === "Manager"; //was blocking the add product button 
  const isManager = true;


  // =============================
  // FETCH PRODUCTS
  // =============================
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // OPEN MODALS
  // =============================
  const openCreate = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // =============================
  // DELETE PRODUCT
  // =============================
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // =============================
  // CREATE OR EDIT SUBMISSION
  // =============================
  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      // CREATE PRODUCT
      if (modalMode === "create") {
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // EDIT PRODUCT
      else if (modalMode === "edit") {
        await axios.put(
          `http://localhost:5000/api/products/${selectedProduct._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Failed to save product");
    }
  };

  // =============================
  // FILTER PRODUCTS
  // =============================
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || p.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  if (loading) {
    return <div className="loading">Loading inventory...</div>;
  }

  return (
    <div className="inventory-container">
      {/* HEADER */}
      <div className="inventory-header">
        <h1>Inventory Management System</h1>
        <p className="subtitle">
          {isManager
            ? "Manage your product inventory and stock levels"
            : "View product inventory and stock levels"}
        </p>
      </div>

      {/* ERROR */}
      {error && <div className="error-banner">⚠️ {error}</div>}

      {/* CONTROLS */}
      <div className="inventory-controls">
        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Category Filter */}
        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* Add Product */}
        {isManager && (
          <button className="btn-add-product" onClick={openCreate}>
            + Add Product
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Qty</th>
              <th>Cost</th>
              <th>Sale</th>
              <th>Revenue</th>
              <th>Status</th>
              {isManager && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p._id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>

                  <td>
                    <span
                      className={`quantity-badge ${
                        p.quantity < 10 ? "low-stock" : ""
                      }`}
                    >
                      {p.quantity}
                    </span>
                  </td>

                  <td>${p.costPrice?.toFixed(2)}</td>
                  <td>${p.salePrice?.toFixed(2)}</td>
                  <td>${p.revenue?.toFixed(2)}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        p.quantity < 10 ? "status-low" : "status-good"
                      }`}
                    >
                      {p.quantity < 10 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>

                  {isManager && (
                    <td className="action-buttons">
                      <button className="btn-edit" onClick={() => openEdit(p)}>
                        ✏️
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteProduct(p._id)}
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER SUMMARY */}
      <div className="inventory-footer">
        <div className="summary-card">
          <span>Total Products:</span>
          <strong>{products.length}</strong>
        </div>

        <div className="summary-card">
          <span>Low Stock Items:</span>
          <strong className="alert">
            {products.filter((p) => p.quantity < 10).length}
          </strong>
        </div>

        <div className="summary-card">
          <span>Total Value:</span>
          <strong>
            $
            {products
              .reduce((sum, p) => sum + p.costPrice * p.quantity, 0)
              .toFixed(2)}
          </strong>
        </div>
      </div>

      {/* PRODUCT MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedProduct}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
