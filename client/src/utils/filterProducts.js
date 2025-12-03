export function filterProducts(products, searchTerm, category) {

  // Normalize search term for case-insensitive matching
  const search = searchTerm.trim().toLowerCase();

  // Start with full product list
  let result = products;

  // Filter by search text
  if (search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search)
    )
  }

  // Filter by category
  if (category && category !== "all") {
    result = result.filter((p) => p.category === category);
  }

  return result;
}