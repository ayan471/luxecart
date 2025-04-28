import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Laptop, Watch, ShoppingBag, Shirt } from "lucide-react";

export default function Categories() {
  const categories = [
    {
      name: "Electronics",
      icon: <Laptop className="h-8 w-8" />,
      href: "/products?category=electronics",
      color: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Jewelry",
      icon: <Watch className="h-8 w-8" />,
      href: "/products?category=jewelery",
      color: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      name: "Men's Clothing",
      icon: <Shirt className="h-8 w-8" />,
      href: "/products?category=men's%20clothing",
      color: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      name: "Women's Clothing",
      icon: <ShoppingBag className="h-8 w-8" />,
      href: "/products?category=women's%20clothing",
      color: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="h-full transition-all hover:shadow-md">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div
                  className={`p-4 rounded-full ${category.color} ${category.textColor} mb-4`}
                >
                  {category.icon}
                </div>
                <h3 className="font-medium">{category.name}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
