//import { sendResetPasswordEmail } from "../utils/email.js"; // email helper (Aiko's task)

/**
 Add into password reset route
 // Send email to user
await sendResetPasswordEmail(user.email, resetToken);
 */

import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/email.js";


const router = express.Router(); 

router.post('/register', async (req, res) => {
    const {firstName, lastName, email, password, role} = req.body;
    
    try{
        //check for existing emails (needs to be added)

        //hash password
        const saltRounds = 10; //most common value but can be adjusted 
        const hashedPassword = await bcrypt.hash(password, saltRounds); 
        
        const newUser = new User({firstName, lastName, email, passwordHash: hashedPassword, role})
        await newUser.save(); 

        res.status(201).json({ message: 'User registered successfully'});
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'An error occurred'});
    }
}); 


router.post('/forgot-password', async (req, res) => {
    const {email} = req.body; 
    try{
       // check for existing user and redirect link (needs to be added)
      

       // generates a raw token 
        const rawToken = crypto.randomBytes(32).toString("hex");

        //hash token
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        //save hashed token and expiration time 
        user.resetPasswordToken = hashedToken; 
        user.resetPasswordExpires = Date.now() + 1000 * 60 * 10; //valid for 10 minutes
        await user.save();

        await sendResetPasswordEmail(user.email, rawToken)
        res.json({message: "Password reset link sent to email"})
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({message: "Server error"}); 
    }
}); 

router.post('/reset-password', async (req, res) => {
    const {token, password} = req.body;
    try{
        
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        //looks for user with matching token and checks if its not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now()}
        });

        if(!user){
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }
        
        //hash new password 
        const saltRounds = 10; //most common value but can be adjusted 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.passwordHash = hashedPassword;

        //clears reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        res.json({message: "Password reset successful"});
    }catch(error){
        console.error("Reset Password Error:", error);
        res.status(500).json({message: "Server error"});
    }
});

export default router; 








