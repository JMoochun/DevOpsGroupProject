import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import passport from "./auth/passport.js";
import productRoutes from "./routes/products.routes.js";
import connectDB from "./db.js";


const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(passport.initialize());
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes);

//Route for testing **Can remove later
app.get("/", (req, res) => res.send("API Running"));



const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => console.log("Server running on port:", PORT));
});