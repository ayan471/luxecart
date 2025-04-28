import ProductCard from "./product-card";

async function getRelatedProducts(category: string, currentProductId: number) {
  try {
    const res = await fetch(
      `https://fakestoreapi.com/products/category/${encodeURIComponent(
        category
      )}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!res.ok) throw new Error("Failed to fetch related products");
    const products = await res.json();
    return products
      .filter((product: any) => product.id !== currentProductId)
      .slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

export default async function RelatedProducts({
  category,
  currentProductId,
}: {
  category: string;
  currentProductId: number;
}) {
  const products = await getRelatedProducts(category, currentProductId);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
