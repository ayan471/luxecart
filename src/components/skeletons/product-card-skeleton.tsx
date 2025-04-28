import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square p-4 flex items-center justify-center bg-muted/20">
        <Skeleton className="h-[80%] w-[80%]" />
      </div>

      <CardContent className="p-4">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-3/4" />
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
}
