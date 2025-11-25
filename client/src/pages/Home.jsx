import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

// Sample low stock data - replace with API call to David S's endpoint
const LOW_STOCK_MOCK_DATA = [
    { id: 1, name: "Wireless Mouse", sku: "WM-2025", quantity: 5, reorderLevel: 10 },
    { id: 2, name: "USB-C Cable", sku: "USBC-001", quantity: 3, reorderLevel: 15 },
    { id: 3, name: "Keyboard", sku: "KB-104", quantity: 8, reorderLevel: 12 },
];

const Home = () => {
    const { user } = useAuth();
    const isManager = user?.role === "manager";
    const [lowStockItems, setLowStockItems] = useState([]);

    useEffect(() => {
       
        setTimeout(() => {
            setLowStockItems(LOW_STOCK_MOCK_DATA);
        }, 500);
    }, []);

    const metrics = {
        totalProducts: 1247,
        lowStockCount: lowStockItems.length,
        totalValue: "$458,920"
    };

    return (
        <div className="dashboard-container">
            <section className="metrics-grid">
                <div className="metric-card primary">
                    <h3>Total Products</h3>
                    <p className="metric-value">{metrics.totalProducts}</p>
                    <small className="metric-footer">Across all branches</small>
                </div>

                <div className="metric-card warning">
                    <h3>Low Stock Items</h3>
                    <p className="metric-value">{metrics.lowStockCount}</p>
                    <small className="metric-footer">Need immediate attention</small>
                </div>

                {isManager && (
                    <div className="metric-card success">
                        <h3>Total Inventory Value</h3>
                        <p className="metric-value">{metrics.totalValue}</p>
                        <small className="metric-footer">Based on current stock</small>
                    </div>
                )}
            </section>

            {lowStockItems.length > 0 && (
                <section className="low-stock-section">
                    <h2 className="section-title">🔴 Low Stock Products</h2>
                    <div className="stock-table-container">
                        <table className="stock-table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>SKU</th>
                                    <th>Current Qty</th>
                                    <th>Reorder Level</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockItems.map(item => (
                                    <tr key={item.id} className="low-stock-row">
                                        <td>{item.name}</td>
                                        <td><code>{item.sku}</code></td>
                                        <td className="qty-low">{item.quantity}</td>
                                        <td>{item.reorderLevel}</td>
                                        <td>
                                            <span className="status-badge critical">
                                                Critical
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            <section className="summary-panels">
                <div className="info-box">
                    <h2>Home screen Information for the user</h2>
                    <p>Welcome to the Inventory Management System. Access reports, notifications, and inventory controls via the navigation above.</p>
                </div>

                <div className="info-box">
                    <h2>IMS Information for the user</h2>
                    <p>Real-time inventory data is displayed in the metrics section. Notifications will alert you to low stock items requiring attention.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;