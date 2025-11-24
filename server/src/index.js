import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";


const app = express();


app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(passport.initialize());
app.use("/api/auth", authRoutes)
//Route for testing **Can remove later
app.get("/", (req, res) => res.send("API Running"));



const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI).then(() => {
    app.listen(PORT, () => console.log("Server running on port:", PORT));
});