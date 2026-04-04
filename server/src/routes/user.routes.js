// server/src/routes/user.routes.js
import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import User from "../models/User.js";

const router = express.Router();

// ====================================
// GET CURRENT USER PROFILE
// ====================================
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        mutedCategories: user.mutedCategories || [],
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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
        role: updatedUser.role,
        mutedCategories: updatedUser.mutedCategories || [],
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);        // Log the error for debugging
    res.status(500).json({ message: "Server error" });  // Send generic server error
  }
});

// ====================================
// UPDATE MUTED NOTIFICATION CATEGORIES
// ====================================
router.put("/notifications/preferences", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;                       
    const { category, action } = req.body;            

    if (!category || !action) {
      return res.status(400).json({ message: "Category and action are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (action === "mute") {
      if (!user.mutedCategories.includes(category)) {
        user.mutedCategories.push(category);
      }
    } else if (action === "unmute") {
      user.mutedCategories = user.mutedCategories.filter(c => c !== category);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();

    res.json({
      message: "Notification preferences updated",
      mutedCategories: user.mutedCategories
    });

  } catch (err) {
    console.error("Notification preference update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;