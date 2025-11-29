// server/src/routes/user.routes.js
import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import User from "../models/User.js";

const router = express.Router();

// ====================================
// UPDATE LOGGED-IN USER PROFILE (PUT)
// ====================================
router.put("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;                       // Extract user ID from token
    const { firstName, lastName, email } = req.body;  // Allowed fields to edit

    // Only allow these fields to change (not role)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },     // Only update these fields
      { new: true, runValidators: true }  // Return new version + enforce schema validators
    );

    // If user does not exist (should not happen unless deleted)
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send a success response with the updated user data
    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,       // Role included as read-only in response
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);        // Log the error for debugging
    res.status(500).json({ message: "Server error" });  // Send generic server error
  }
});

export default router;
