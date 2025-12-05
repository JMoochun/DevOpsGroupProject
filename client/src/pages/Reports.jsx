// client/src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import "./Reports.css"; // optional styling
import * as XLSX from "xlsx";

const Reports = () => {
    const [data, setData] = useState({
        products: [],
        totals: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await api.get("/reports/inventory");
                setData({
                    products: res.data.products || [],
                    totals: res.data.totals || null,
                });
            } catch (err) {
                console.error("Failed to load report:", err);
                setError("Failed to load report data.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    const formatCurrency = (n) =>
        n != null ? `$${Number(n).toFixed(2)}` : "-";

    //Download report as Excel
    const handleExportExcel = () => {
        if (!data.products || data.products.length === 0) {
            alert("No products to export.");
            return;
        }

        // 1) Build the main sheet rows from products
        const productRows = data.products.map((p) => ({
            "Product Name": p.name,
            SKU: p.sku,
            Category: p.category,
            Cost: p.cost,
            "Sale Price": p.salePrice,
            Quantity: p.quantity,
            Revenue: p.revenue,
            Profit: p.totalProfit,
            "Margin %": p.profitMargin,
        }));

        const wsProducts = XLSX.utils.json_to_sheet(productRows);

        // 2) Optional summary sheet
        let wsSummary = null;
        if (data.totals) {
            const t = data.totals;
            const summaryRows = [
                { Metric: "Total Products", Value: t.totalProducts },
                { Metric: "Total Quantity", Value: t.totalQuantity },
                { Metric: "Total Revenue", Value: t.totalRevenue },
                { Metric: "Total Profit", Value: t.totalProfit },
            ];
            wsSummary = XLSX.utils.json_to_sheet(summaryRows);
        }

        // 3) Create workbook and append sheets
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsProducts, "Inventory Report");
        if (wsSummary) {
            XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
        }

        // 4) Trigger download
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
        XLSX.writeFile(wb, `inventory-report-${today}.xlsx`);
    };

    return (
        <div className="page-container">
            <h1>Report</h1>

            {/* Download button */}
            <button
                type="button"
                className="btn-primary"
                style={{ marginBottom: "1rem" }}
                onClick={handleExportExcel}
                disabled={loading || !data.products.length}
            >
                Download as Excel
            </button>

            {loading && <p>Loading report...</p>}
            {error && <p className="error-text">{error}</p>}

            {!loading && !error && data.totals && (
                <>
                    {/* Summary cards */}
                    <div className="report-summary-grid">
                        <div className="report-card">
                            <h3>Total Products</h3>
                            <p>{data.totals.totalProducts}</p>
                        </div>
                        <div className="report-card">
                            <h3>Total Quantity</h3>
                            <p>{data.totals.totalQuantity}</p>
                        </div>
                        <div className="report-card">
                            <h3>Total Revenue (Potential)</h3>
                            <p>{formatCurrency(data.totals.totalRevenue)}</p>
                        </div>
                        <div className="report-card">
                            <h3>Total Profit (Potential)</h3>
                            <p>{formatCurrency(data.totals.totalProfit)}</p>
                        </div>
                    </div>

                    {/* Inventory Report table */}
                    <div className="report-table-card">
                        <h2>Inventory Profitability Report</h2>
                        <p className="muted">
                            All products currently in the system with cost, sale price,
                            revenue, and profit.
                        </p>

                        <div className="table-wrapper">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>SKU</th>
                                        <th>Category</th>
                                        <th>Cost</th>
                                        <th>Sale Price</th>
                                        <th>Qty</th>
                                        <th>Revenue</th>
                                        <th>Profit</th>
                                        <th>Margin %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.products.length === 0 && (
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: "center" }}>
                                                No products found.
                                            </td>
                                        </tr>
                                    )}
                                    {data.products.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td>{p.sku}</td>
                                            <td>{p.category}</td>
                                            <td>{formatCurrency(p.cost)}</td>
                                            <td>{formatCurrency(p.salePrice)}</td>
                                            <td>{p.quantity}</td>
                                            <td>{formatCurrency(p.revenue)}</td>
                                            <td>{formatCurrency(p.totalProfit)}</td>
                                            <td>
                                                {p.profitMargin != null ? `${p.profitMargin}%` : "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;
