import express from "express";
import Product from "../models/Product.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

// ============================
// CREATE PRODUCT (POST)
// ============================
router.post("/", requireAuth, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// ============================
// GET ALL PRODUCTS (GET)
// ============================
router.get("/", requireAuth, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ============================
// GET SINGLE PRODUCT (GET BY ID)
// ============================
router.get("/:id", requireAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ============================
// UPDATE PRODUCT (PUT)
// ============================
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedProduct)
            return res.status(404).json({ message: "Product not found" });

        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// ============================
// DELETE PRODUCT (DELETE)
// ============================
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct)
            return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
