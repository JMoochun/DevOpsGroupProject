import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    //Distinguish between employee vs manager
    role: { type: String, enum: ["admin", "manager", "employee"], default: "employee" },
   
    //required for reset-password
    resetPasswordToken: { type: String},
    resetPasswordExpires: { type: Date}
}, { timestamps: true });

export default mongoose.model("User", userSchema);