import { describe, it, expect } from "vitest";
import { validateRegisterInput } from "../src/utils/registerValidation.js";

// Test suite for registration input validation
describe("validateRegisterInput() - Strong Password Rules", () => {

  it("returns full set of password errors when password is empty", () => {
    const result = validateRegisterInput({
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      password: "",
      role: "employee"
    });

    expect(result.password).toBe("Password is required");
  });

  it("fails if password is too short", () => {
    const result = validateRegisterInput({
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      password: "Aa1!",
      role: "employee"
    });

    expect(result.password).toContain("6 characters");
  });

  it("fails if missing uppercase", () => {
    const result = validateRegisterInput({
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      password: "abc123!",
      role: "employee"
    });

    expect(result.password).toContain("uppercase");
  });

  it("fails if missing lowercase", () => {
    const result = validateRegisterInput({
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      password: "ABC123!",
      role: "employee"
    });

    expect(result.password).toContain("lowercase");
  });

  it("fails if missing number", () => {
    const result = validateRegisterInput({
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      password: "Abcdef!",
      role: "employee"
    });

    expect(result.password).toContain("number");
  });

  it("fails if missing special character", () => {
    const result = validateRegisterInput({
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      password: "Abcdef1",
      role: "employee"
    });

    expect(result.password).toContain("special character");
  });

  it("passes when password meets ALL conditions", () => {
    const result = validateRegisterInput({
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      password: "Abcd123!",
      role: "employee"
    });

    // No password errors
    expect(result.password).toBeUndefined();
  });

});
