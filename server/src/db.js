import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(uri)
        console.log("MongoDB Connected Successfully.")
    } catch (err) {
        console.error("Mongodb Failed to Connect:", err.message);
        process.exit(1);
    }
};