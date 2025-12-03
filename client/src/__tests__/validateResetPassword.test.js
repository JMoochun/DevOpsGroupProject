import { describe, it, expect } from "vitest";
import { validateResetPassword } from "../utils/validateResetPassword";

// This test suite checks all password rules
describe("validateResetPassword()", () => {

  it("fails if password is too short", () => {
    expect(validateResetPassword("Ab1!", "Ab1!"))
      .toBe("Password must be at least 6 characters");
  });

  it("fails if missing uppercase letter", () => {
    expect(validateResetPassword("abc123!", "abc123!"))
      .toBe("Password must contain at least 1 uppercase letter");
  });

  it("fails if missing lowercase letter", () => {
    expect(validateResetPassword("ABC123!", "ABC123!"))
      .toBe("Password must contain at least 1 lowercase letter");
  });

  it("fails if missing number", () => {
    expect(validateResetPassword("Abcdef!", "Abcdef!"))
      .toBe("Password must contain at least 1 number");
  });

  it("fails if missing special character", () => {
    expect(validateResetPassword("Abcdef1", "Abcdef1"))
      .toBe("Password must contain at least 1 special character (!@#$%^&*)");
  });

  it("fails if passwords don't match", () => {
    expect(validateResetPassword("Abc123!", "Wrong123!"))
      .toBe("Passwords do not match");
  });

  it("passes if password fully matches all strong rules and matches confirmPassword", () => {
    expect(validateResetPassword("Abcd1!", "Abcd1!"))
      .toBe("");
  });

});
