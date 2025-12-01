import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "./auth/passport.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import notifRoutes from "./routes/notifications.routes.js";
import connectDB from "./db.js";

const app = express();

// Logging
app.use(morgan("dev"));

// Parse JSON
app.use(express.json());

// CORS - only once, matching frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/notifications", notifRoutes);

// Test route
app.get("/", (req, res) => res.send("API Running"));

// Start server after DB connection
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log("Server running on port:", PORT));
});
