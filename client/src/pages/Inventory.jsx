import { useState, useEffect } from "react";
import axios from "axios";
import ProductModal from "../components/ProductModal";
import "../Inventory.css";
import { useNotifications } from "../context/NotificationContext";

export default function Inventory() {

  const { refreshNotifications } = useNotifications(); 
  // =============================
  // STATE
  // =============================
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isManager = user.role === "manager";


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
        await refreshNotifications();
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
        await refreshNotifications();
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Failed to save product");
      throw err;
    }
  };

  // =============================
  // FILTER PRODUCTS
  // =============================
  const lowStock = (p) =>
    p.quantity <= (p.lowStockThreshold ?? 10);

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
        <div className="filter-wrapper">
            <select
                className="filter-box"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
            >
                {categories.map((cat) => (
                <option key={cat}>{cat}</option>
                ))}
            </select>
        </div>

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
                <td colSpan={isManager ? 9 : 8} className="no-data">
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
                        lowStock(p) ? "low-stock" : ""
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
                        lowStock(p) ? "status-low" : "status-good"
                      }`}
                    >
                      {lowStock(p) ? "Low Stock" : "In Stock"}
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
            {products.filter((p) => lowStock(p)).length}
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
