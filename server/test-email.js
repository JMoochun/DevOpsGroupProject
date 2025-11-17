// Test script to manually send a reset email - Aiko
import "dotenv/config";                          // Loads .env
import { sendResetPasswordEmail } from "./src/utils/email.js"; // Import helper

// Wrap the call in an async function so we can use await
async function run() {
  const testEmail = "team3.ims.comp231@gmail.com"; // email to test
  const fakeToken = "TEST_TOKEN_123";                   // fake token just for testing

  try {
    console.log("Sending test reset email...");
    await sendResetPasswordEmail(testEmail, fakeToken);
    console.log("Test email sent successfully");
  } catch (err) {
    console.error("Failed to send test email");
    console.error(err);
  }
}

// Run the test
run();
