import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
        console.log("Mongo URI:", uri ? "(configured)" : "(missing)");

        if (!uri) {
            throw new Error("No Mongo URI set in env (MONGO_URI / MONGODB_URI)");
        }

        await mongoose.connect(uri);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err; // so index.js sees the failure
    }
};

export default connectDB;

