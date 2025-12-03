import { describe, it, expect } from "vitest";
import { validateSupportContact } from "../utils/validateSupportContact";

describe("validateSupportContact()", () => {

  it("fails when fields are empty", () => {
    const result = validateSupportContact({
      name: "",
      email: "",
      phone: "",
      hours: ""
    });
    expect(result.name).toBe("Name is required");
    expect(result.email).toBe("Email is required");
    expect(result.phone).toBe("Phone number is required");
    expect(result.hours).toBe("Hours are required");
  });

  it("fails when email is invalid", () => {
    const result = validateSupportContact({
      name: "Test",
      email: "invalidmail",
      phone: "123-456-7890",
      hours: "9-5"
    });
    expect(result.email).toBe("Invalid email format");
  });

  it("fails when phone is invalid", () => {
    const result = validateSupportContact({
      name: "Test",
      email: "valid@email.com",
      phone: "1234",
      hours: "9-5"
    });
    expect(result.phone).toBe("Invalid phone format");
  });

  it("passes when all fields are valid", () => {
    const result = validateSupportContact({
      name: "IT Support",
      email: "itsupport@test.com",
      phone: "123-456-7890",
      hours: "9-5"
    });
    expect(Object.keys(result).length).toBe(0);
  });

});
