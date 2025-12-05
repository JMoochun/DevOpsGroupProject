// server/src/routes/reports.routes.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * GET /api/reports/inventory
 * Returns:
 * - list of products with profit & revenue fields
 * - overall totals
 */
router.get("/inventory", async (req, res) => {
  try {
    const products = await Product.find().lean(); // lean() -> plain JS objects

    const rows = products.map((p) => {
      const cost = Number(p.costPrice ?? 0);          // adjust field names if needed
      const salePrice = Number(p.salePrice ?? 0);
      const quantity = Number(p.quantity ?? 0);

      const revenue = salePrice * quantity;
      const profitPerUnit = salePrice - cost;
      const totalProfit = profitPerUnit * quantity;
      const profitMargin =
        cost > 0 ? Number(((salePrice - cost) / cost) * 100).toFixed(1) : null;

      return {
        id: p._id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        cost,
        salePrice,
        quantity,
        revenue,
        totalProfit,
        profitMargin, // percentage
      };
    });

    const totals = rows.reduce(
      (acc, r) => {
        acc.totalProducts += 1;
        acc.totalQuantity += r.quantity;
        acc.totalRevenue += r.revenue;
        acc.totalProfit += r.totalProfit;
        return acc;
      },
      {
        totalProducts: 0,
        totalQuantity: 0,
        totalRevenue: 0,
        totalProfit: 0,
      }
    );

    res.json({ products: rows, totals });
  } catch (err) {
    console.error("Error building inventory report:", err);
    res.status(500).json({ message: "Failed to load report" });
  }
});

export default router;
