"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Laptop,
  Watch,
  Shirt,
  ShoppingBag,
  Home,
  Utensils,
  Dumbbell,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Main categories with subcategories
const categoryData = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Cutting-edge devices and gadgets",
    icon: <Laptop className="h-8 w-8" />,
    image: "/category-electronics.png",
    color: "bg-blue-100 dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
    featured: true,
    subcategories: [
      { name: "Smartphones", count: 24 },
      { name: "Laptops", count: 18 },
      { name: "Audio", count: 32 },
      { name: "Accessories", count: 45 },
    ],
  },
  {
    id: "jewelery",
    name: "Jewelry",
    description: "Elegant pieces for every occasion",
    icon: <Watch className="h-8 w-8" />,
    image: "/category-jewelry.png",
    color: "bg-amber-100 dark:bg-amber-900/20",
    textColor: "text-amber-600 dark:text-amber-400",
    featured: true,
    subcategories: [
      { name: "Necklaces", count: 16 },
      { name: "Rings", count: 22 },
      { name: "Earrings", count: 19 },
      { name: "Watches", count: 12 },
    ],
  },
  {
    id: "men's clothing",
    name: "Men's Clothing",
    description: "Contemporary styles for modern men",
    icon: <Shirt className="h-8 w-8" />,
    image: "/category-mens.png",
    color: "bg-green-100 dark:bg-green-900/20",
    textColor: "text-green-600 dark:text-green-400",
    featured: true,
    subcategories: [
      { name: "T-shirts", count: 28 },
      { name: "Jackets", count: 15 },
      { name: "Pants", count: 20 },
      { name: "Accessories", count: 17 },
    ],
  },
  {
    id: "women's clothing",
    name: "Women's Clothing",
    description: "Stylish apparel for every season",
    icon: <ShoppingBag className="h-8 w-8" />,
    image: "/category-womens.png",
    color: "bg-purple-100 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
    featured: true,
    subcategories: [
      { name: "Dresses", count: 34 },
      { name: "Tops", count: 42 },
      { name: "Outerwear", count: 19 },
      { name: "Accessories", count: 26 },
    ],
  },
  {
    id: "home",
    name: "Home & Living",
    description: "Elevate your living space",
    icon: <Home className="h-8 w-8" />,
    image: "/category-home.png",
    color: "bg-orange-100 dark:bg-orange-900/20",
    textColor: "text-orange-600 dark:text-orange-400",
    featured: false,
    subcategories: [
      { name: "Decor", count: 38 },
      { name: "Furniture", count: 24 },
      { name: "Bedding", count: 19 },
      { name: "Lighting", count: 22 },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen & Dining",
    description: "Premium culinary essentials",
    icon: <Utensils className="h-8 w-8" />,
    image: "/category-kitchen.png",
    color: "bg-red-100 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-400",
    featured: false,
    subcategories: [
      { name: "Cookware", count: 26 },
      { name: "Appliances", count: 18 },
      { name: "Tableware", count: 32 },
      { name: "Utensils", count: 24 },
    ],
  },
  {
    id: "fitness",
    name: "Fitness & Sport",
    description: "Equipment for active lifestyles",
    icon: <Dumbbell className="h-8 w-8" />,
    image: "/category-fitness.png",
    color: "bg-teal-100 dark:bg-teal-900/20",
    textColor: "text-teal-600 dark:text-teal-400",
    featured: false,
    subcategories: [
      { name: "Workout Gear", count: 29 },
      { name: "Activewear", count: 36 },
      { name: "Equipment", count: 22 },
      { name: "Accessories", count: 18 },
    ],
  },
  {
    id: "books",
    name: "Books & Media",
    description: "Expand your knowledge and entertainment",
    icon: <BookOpen className="h-8 w-8" />,
    image: "/category-books.png",
    color: "bg-indigo-100 dark:bg-indigo-900/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
    featured: false,
    subcategories: [
      { name: "Fiction", count: 48 },
      { name: "Non-Fiction", count: 52 },
      { name: "Audiobooks", count: 34 },
      { name: "Magazines", count: 26 },
    ],
  },
];

export default function CategoryGrid() {
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter categories based on active tab
  const filteredCategories =
    activeTab === "all"
      ? categoryData
      : activeTab === "featured"
      ? categoryData.filter((cat) => cat.featured)
      : categoryData.filter((cat) => !cat.featured);

  return (
    <div className="space-y-8">
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full justify-center"
      >
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="other">Other Categories</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    image: string;
    color: string;
    textColor: string;
    subcategories: { name: string; count: number }[];
  };
}

function CategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

          <div className="absolute bottom-0 left-0 p-4 w-full">
            <div
              className={`inline-flex items-center justify-center p-2 rounded-full ${category.color} ${category.textColor} mb-2`}
            >
              {category.icon}
            </div>
            <h3 className="text-xl font-bold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Popular in {category.name}</h4>
            <ul className="space-y-1">
              {category.subcategories.slice(0, 4).map((subcat) => (
                <li key={subcat.name} className="text-sm">
                  <Link
                    href={`/products?category=${encodeURIComponent(
                      category.id
                    )}&subcategory=${encodeURIComponent(subcat.name)}`}
                    className="flex items-center justify-between group"
                  >
                    <span className="group-hover:text-primary transition-colors">
                      {subcat.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {subcat.count} items
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 group"
              asChild
            >
              <Link
                href={`/products?category=${encodeURIComponent(category.id)}`}
              >
                <span className="group-hover:underline">View All</span>
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
