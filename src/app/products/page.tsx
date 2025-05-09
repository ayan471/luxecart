import { Suspense } from "react";
import ProductList from "@/components/product-list";
import ProductFilters from "@/components/product-filters";
import ProductsSkeleton from "@/components/skeletons/products-skeleton";

// Add this export to make the page dynamic
export const dynamic = "force-dynamic";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <Suspense
            fallback={
              <div className="h-12 bg-muted/20 animate-pulse rounded-md"></div>
            }
          >
            <ProductFilters />
          </Suspense>
        </div>
        <div className="w-full md:w-3/4">
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
