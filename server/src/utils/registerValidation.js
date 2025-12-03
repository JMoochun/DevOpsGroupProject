export function validateRegisterInput({ firstName, lastName, email, password, role }) {
  const errors = {};

  // Validate first name
  if (!firstName?.trim()) {
    errors.firstName = "First name is required";
  } else if (firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  // Validate last name
  if (!lastName?.trim()) {
    errors.lastName = "Last name is required";
  } else if (lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

    // Validate password
  if (!password?.trim()) {
    errors.password = "Password is required";
  } else {
    const pwdErrors = [];

    if (password.length < 6)
      pwdErrors.push("* Must be at least 6 characters");

    if (!/[A-Z]/.test(password))
      pwdErrors.push("* Must contain at least 1 uppercase letter");

    if (!/[a-z]/.test(password))
      pwdErrors.push("* Must contain at least 1 lowercase letter");

    if (!/\d/.test(password))
      pwdErrors.push("* Must contain at least 1 number");

    if (!/[!@#$%^&*]/.test(password))
      pwdErrors.push("* Must contain at least 1 special character (!@#$%^&*)");

    if (pwdErrors.length > 0)
      errors.password = pwdErrors.join("\n"); // same formatting as frontend
  }

  // Validate role
  const allowedRoles = ["employee", "manager", "accountant", "it_support"];
  if (!allowedRoles.includes(role)) {
    errors.role = "Invalid role selected";
  }

  return errors;
}
