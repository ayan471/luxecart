import { Suspense } from "react";
import ProductCard from "./product-card";
import ProductCardSkeleton from "./skeletons/product-card-skeleton";

// Add this export to make the component dynamic
export const dynamic = "force-dynamic";

async function getProducts(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  try {
    // Base URL
    let url = "https://fakestoreapi.com/products";

    // Handle category filter
    const category = searchParams.category;
    if (category && typeof category === "string") {
      url = `https://fakestoreapi.com/products/category/${encodeURIComponent(
        category
      )}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    let products = await res.json();

    // Handle additional filters on the client side since the API doesn't support them

    // Handle price range filter
    const minPrice = searchParams.minPrice
      ? Number(searchParams.minPrice)
      : undefined;
    const maxPrice = searchParams.maxPrice
      ? Number(searchParams.maxPrice)
      : undefined;

    if (minPrice !== undefined || maxPrice !== undefined) {
      products = products.filter((product: any) => {
        if (minPrice !== undefined && product.price < minPrice) return false;
        if (maxPrice !== undefined && product.price > maxPrice) return false;
        return true;
      });
    }

    // Handle rating filter
    const rating = searchParams.rating
      ? Number(searchParams.rating)
      : undefined;
    if (rating !== undefined) {
      products = products.filter(
        (product: any) =>
          product.rating && Math.round(product.rating.rate) >= rating
      );
    }

    // Handle sort option
    const sort = searchParams.sort;
    if (sort) {
      switch (sort) {
        case "price-asc":
          products.sort((a: any, b: any) => a.price - b.price);
          break;
        case "price-desc":
          products.sort((a: any, b: any) => b.price - a.price);
          break;
        case "rating":
          products.sort((a: any, b: any) => b.rating.rate - a.rating.rate);
          break;
        case "newest":
          // Since we don't have date in the API, we'll just reverse the order as a simulation
          products.reverse();
          break;
      }
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductList({
  searchParams = {},
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const products = await getProducts(searchParams);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">No products found</h2>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product: any) => (
        <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
          <ProductCard product={product} enableDrag={true} />
        </Suspense>
      ))}
    </div>
  );
}
