import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <Skeleton className="aspect-square w-full rounded-lg" />

        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-20 w-20 rounded-lg" />
          <Skeleton className="h-20 w-20 rounded-lg" />
          <Skeleton className="h-20 w-20 rounded-lg" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-full mb-2" />

          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-1" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        <Skeleton className="h-8 w-32" />

        <Skeleton className="h-20 w-full" />

        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>

        <Skeleton className="h-16 w-full rounded-lg" />

        <Tabs defaultValue="description">
          <TabsList className="w-full">
            <TabsTrigger value="description" className="flex-1">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="flex-1">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <Card className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
