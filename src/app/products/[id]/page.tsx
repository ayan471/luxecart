import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product-detail";
import ProductDetailSkeleton from "@/components/skeletons/product-detail-skeleton";
import RelatedProducts from "@/components/related-products";
import ProductsSkeleton from "@/components/skeletons/products-skeleton";

async function getProduct(id: string) {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail product={product} />
      </Suspense>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <Suspense fallback={<ProductsSkeleton />}>
          <RelatedProducts
            category={product.category}
            currentProductId={product.id}
          />
        </Suspense>
      </div>
    </div>
  );
}
