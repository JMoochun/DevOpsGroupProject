import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    category: { type: String, trim: true },

    //Product $$ schema section
    //What we pay
    cost: { type: Number, required: true, min: 0 },
    //What we sell the product for
    salePrice: { type: Number, required: true, min: 0 },
    //revenue
    revenue: { type: Number, default: 0 },

    quantity: { type: Number, required: true, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },

}, { timestamps: true });

export default mongoose.model("Product", productSchema);