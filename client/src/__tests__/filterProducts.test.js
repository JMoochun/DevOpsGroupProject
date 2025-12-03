import { describe, it, expect } from "vitest";
import { filterProducts } from "../utils/filterProducts.js";

// Mock product data for testing
const mockProducts = [
  { name: "Laptop", category: "electronics" },
  { name: "Desk", category: "furniture" },
  { name: "Mouse", category: "electronics" }
];

// Tests for filterProducts function
describe("filterProducts()", () => {

  // Test cases
  it("returns all items when no filters applied", () => {
    const result = filterProducts(mockProducts, "", "all");
    expect(result.length).toBe(3);
  })

  it("filters by search term", () => {
    const result = filterProducts(mockProducts, "lap", "all");
    expect(result.length).toBe(1);
  })

  it("filters by category", () => {
    const result = filterProducts(mockProducts, "", "electronics");
    expect(result.length).toBe(2);
  })

  it("applies both filters", () => {
    const result = filterProducts(mockProducts, "mouse", "electronics");
    expect(result.length).toBe(1);
  })

})