import { describe, it, expect } from "vitest";
import { hashPassword } from "../src/utils/hashPassword";
import bcrypt from "bcrypt";

describe("hashPassword()", () => {

  it("returns a hashed password different from the input", async () => {
    
    // Original plain text password
    const plain = "mypassword";

    // Hash the password
    const hashed = await hashPassword(plain);

    // Hashed should not equal original text
    expect(hashed).not.toBe(plain);

    // Bcrypt should verify the hash
    const valid = await bcrypt.compare(plain, hashed);
    
    // Valid means hashing worked correctly
    expect(valid).toBe(true);
  })

})
