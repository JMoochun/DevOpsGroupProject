import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "./auth/passport.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import notifRoutes from "./routes/notifications.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./db.js";

const app = express();

// Logging
app.use(morgan("dev"));

// Parse JSON
app.use(express.json());

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

// CORS - only once, matching frontend
app.use(cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
}));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/notifications", notifRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => res.send("API Running"));

// define PORT here
const PORT = process.env.PORT || 5000;

export default app;

// Start server after DB connection
connectDB().then(() => {
    app.listen(PORT, () =>
        console.log(`Server running on port: ${PORT}`)
    );
});
