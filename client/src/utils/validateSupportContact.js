export function validateSupportContact(data) {
  const errors = {};

  // Validate name
  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(data.email)) {
    errors.email = "Invalid email format";
  }

  // Validate phone
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(data.phone)) {
    errors.phone = "Invalid phone format";
  }

  // Validate hours
  if (!data.hours.trim()) {
    errors.hours = "Hours are required";
  }

  return errors;
}
