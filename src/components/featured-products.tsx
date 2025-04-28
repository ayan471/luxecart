import ProductCard from "./product-card";

async function getFeaturedProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products?limit=4", {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
