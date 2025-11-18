// Email helper for password reset using Nodemailer + SMTP - Aiko's task
import nodemailer from "nodemailer";

// Create SMTP transporter (email credentials required in .env)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // STARTTLS on port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function - Sends the password reset email (called from forgot-password route)
async function sendResetPasswordEmail(toEmail, resetToken) {

    // Build the reset link that takes the user to the reset password page
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`; // 'resetToken' is the unique link parameter generated

    // Email content that is sent to the user
    const mailContent = {
        from: process.env.EMAIL_FROM || '"IMS Support" <team3.ims.comp231@gmail.com>', // “from” display name
        to: toEmail, // 'toEmail' is the recipient email entered in Forgot Password
        subject: "Reset your IMS password", // Email subject line
        html: 
        `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password.</p>
        <p>Click the link below to continue:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
        `,
    };

    // Send the email using SMTP transporter & capture result
    const info = await transporter.sendMail(mailContent);

    // Success console message
    console.log("Message sent:", info.messageId);
}

// Export function
export { sendResetPasswordEmail };