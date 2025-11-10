import mongoose from "mongoose";

expost const connectDB = async (uri) => {
    try {
        mongoose.set("stringQuery", true);
        await mongoose.connect(uri)
        console.log("MongoDB Connected Successfully.")
    } catch (err) {
        console.error("Mongodb Failed to Connect:, " err.message);
        process.exit(1);
    }
};