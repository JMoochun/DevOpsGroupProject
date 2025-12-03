export function validateResetPassword(password, confirmPassword) {

  // Trim password to avoid mistakes caused by spaces
  const pwd = password.trim();

  
// Check password rules
  if (pwd.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (!/[A-Z]/.test(pwd)) {
    return "Password must contain at least 1 uppercase letter";
  }

  if (!/[a-z]/.test(pwd)) {
    return "Password must contain at least 1 lowercase letter";
  }

  if (!/\d/.test(pwd)) {
    return "Password must contain at least 1 number";
  }

  if (!/[!@#$%^&*]/.test(pwd)) {
    return "Password must contain at least 1 special character (!@#$%^&*)";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  // If all checks pass → return empty string = success
  return "";
}
