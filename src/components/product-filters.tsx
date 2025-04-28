"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "./ui/badge";
import { Suspense } from "react";

// Wrap the component content in a function to use with Suspense
function ProductFiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    color: false,
    size: false,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    categories: string[];
    rating: number[];
    price: number[];
    color: string[];
    size: string[];
  }>({
    categories: [],
    rating: [],
    price: [],
    color: [],
    size: [],
  });
  const [sortOption, setSortOption] = useState("featured");

  // Initialize filters from URL on component mount
  useEffect(() => {
    const category = searchParams.get("category");
    const rating = searchParams.get("rating");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    const newFilters = {
      categories: [],
      rating: [],
      price: [],
      color: [],
      size: [],
    };

    if (category) {
      newFilters.categories = [category];
    }

    if (rating) {
      newFilters.rating = [Number.parseInt(rating)];
    }

    if (minPrice && maxPrice) {
      const min = Number.parseInt(minPrice);
      const max = Number.parseInt(maxPrice);
      setPriceRange([min, max]);
      newFilters.price = [min, max];
    }

    if (sort) {
      setSortOption(sort);
    }

    setActiveFilters(newFilters);
  }, [searchParams]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];
  const ratings = [5, 4, 3, 2, 1];
  const colors = ["Black", "White", "Red", "Blue", "Green"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  const handleCategoryChange = (category: string) => {
    setActiveFilters((prev) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];

      return { ...prev, categories: newCategories };
    });
  };

  const handleRatingChange = (rating: number) => {
    setActiveFilters((prev) => {
      const newRatings = prev.rating.includes(rating)
        ? prev.rating.filter((r) => r !== rating)
        : [...prev.rating, rating];

      return { ...prev, rating: newRatings };
    });
  };

  const handleColorChange = (color: string) => {
    setActiveFilters((prev) => {
      const newColors = prev.color.includes(color)
        ? prev.color.filter((c) => c !== color)
        : [...prev.color, color];

      return { ...prev, color: newColors };
    });
  };

  const handleSizeChange = (size: string) => {
    setActiveFilters((prev) => {
      const newSizes = prev.size.includes(size)
        ? prev.size.filter((s) => s !== size)
        : [...prev.size, size];

      return { ...prev, size: newSizes };
    });
  };

  const handlePriceChange = () => {
    setActiveFilters((prev) => ({ ...prev, price: priceRange }));
  };

  const applyFilters = () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams();

    // Add category filter
    if (activeFilters.categories.length === 1) {
      params.set("category", activeFilters.categories[0]);
    } else if (activeFilters.categories.length > 1) {
      // For multiple categories, we could use a comma-separated list
      params.set("categories", activeFilters.categories.join(","));
    }

    // Add rating filter
    if (activeFilters.rating.length === 1) {
      params.set("rating", activeFilters.rating[0].toString());
    } else if (activeFilters.rating.length > 1) {
      // For multiple ratings, use a comma-separated list
      params.set("ratings", activeFilters.rating.join(","));
    }

    // Add price range filter
    if (activeFilters.price.length === 2) {
      params.set("minPrice", activeFilters.price[0].toString());
      params.set("maxPrice", activeFilters.price[1].toString());
    }

    // Add sort option
    if (sortOption !== "featured") {
      params.set("sort", sortOption);
    }

    // Add color filters if any
    if (activeFilters.color.length > 0) {
      params.set("colors", activeFilters.color.join(","));
    }

    // Add size filters if any
    if (activeFilters.size.length > 0) {
      params.set("sizes", activeFilters.size.join(","));
    }

    // Navigate to the new URL with filters
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setActiveFilters({
      categories: [],
      rating: [],
      price: [],
      color: [],
      size: [],
    });
    setPriceRange([0, 1000]);
    setSortOption("featured");
    router.push("/products");
  };

  const totalActiveFilters =
    activeFilters.categories.length +
    activeFilters.rating.length +
    (activeFilters.price.length ? 1 : 0) +
    activeFilters.color.length +
    activeFilters.size.length;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="md:hidden flex items-center gap-2"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {totalActiveFilters > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalActiveFilters}
              </Badge>
            )}
          </Button>

          <AnimatePresence>
            {totalActiveFilters > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Sort by:
          </span>
          <Select
            value={sortOption}
            onValueChange={(value) => {
              setSortOption(value);
              // Apply sort immediately
              const params = new URLSearchParams(searchParams.toString());
              if (value !== "featured") {
                params.set("sort", value);
              } else {
                params.delete("sort");
              }
              router.push(`/products?${params.toString()}`);
            }}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="md:hidden mb-4">
        <AnimatePresence>
          {activeFilters.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeFilters.categories.map((category) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleCategoryChange(category)}
                    />
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {(mobileFiltersOpen || true) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`space-y-4 ${
              mobileFiltersOpen ? "block" : "hidden md:block"
            }`}
          >
            <Card>
              <CardHeader
                className="py-4 px-6 flex flex-row items-center justify-between cursor-pointer"
                onClick={() => toggleSection("categories")}
              >
                <CardTitle className="text-base">Categories</CardTitle>
                {expandedSections.categories ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>

              <AnimatePresence>
                {expandedSections.categories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 px-6 pb-4">
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div
                            key={category}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`category-${category}`}
                              checked={activeFilters.categories.includes(
                                category
                              )}
                              onCheckedChange={() =>
                                handleCategoryChange(category)
                              }
                            />
                            <Label
                              htmlFor={`category-${category}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Card>
              <CardHeader
                className="py-4 px-6 flex flex-row items-center justify-between cursor-pointer"
                onClick={() => toggleSection("price")}
              >
                <CardTitle className="text-base">Price Range</CardTitle>
                {expandedSections.price ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>

              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 px-6 pb-4">
                      <div className="space-y-4">
                        <Slider
                          defaultValue={[0, 1000]}
                          max={1000}
                          step={10}
                          value={priceRange}
                          onValueChange={setPriceRange}
                        />

                        <div className="flex items-center justify-between">
                          <div className="text-sm">${priceRange[0]}</div>
                          <div className="text-sm">${priceRange[1]}</div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full"
                          onClick={handlePriceChange}
                        >
                          Apply
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Card>
              <CardHeader
                className="py-4 px-6 flex flex-row items-center justify-between cursor-pointer"
                onClick={() => toggleSection("rating")}
              >
                <CardTitle className="text-base">Rating</CardTitle>
                {expandedSections.rating ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>

              <AnimatePresence>
                {expandedSections.rating && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 px-6 pb-4">
                      <div className="space-y-2">
                        {ratings.map((rating) => (
                          <div
                            key={rating}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`rating-${rating}`}
                              checked={activeFilters.rating.includes(rating)}
                              onCheckedChange={() => handleRatingChange(rating)}
                            />
                            <Label
                              htmlFor={`rating-${rating}`}
                              className="text-sm font-normal cursor-pointer flex items-center"
                            >
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className="text-yellow-400">
                                  {i < rating ? "★" : "☆"}
                                </span>
                              ))}
                              {rating === 1 ? " & up" : ""}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Card>
              <CardHeader
                className="py-4 px-6 flex flex-row items-center justify-between cursor-pointer"
                onClick={() => toggleSection("color")}
              >
                <CardTitle className="text-base">Color</CardTitle>
                {expandedSections.color ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>

              <AnimatePresence>
                {expandedSections.color && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 px-6 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => {
                          const isActive = activeFilters.color.includes(color);
                          const bgColor = color.toLowerCase();

                          return (
                            <div
                              key={color}
                              className={`
                                w-8 h-8 rounded-full cursor-pointer flex items-center justify-center
                                ${
                                  isActive
                                    ? "ring-2 ring-primary ring-offset-2"
                                    : ""
                                }
                              `}
                              style={{
                                backgroundColor:
                                  bgColor === "white" ? "#ffffff" : bgColor,
                                border:
                                  bgColor === "white"
                                    ? "1px solid #e2e8f0"
                                    : "none",
                              }}
                              onClick={() => handleColorChange(color)}
                            >
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-white"
                                >
                                  {bgColor === "white" ? (
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M20 6L9 17L4 12"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M20 6L9 17L4 12"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Card>
              <CardHeader
                className="py-4 px-6 flex flex-row items-center justify-between cursor-pointer"
                onClick={() => toggleSection("size")}
              >
                <CardTitle className="text-base">Size</CardTitle>
                {expandedSections.size ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>

              <AnimatePresence>
                {expandedSections.size && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="pt-0 px-6 pb-4">
                      <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                          const isActive = activeFilters.size.includes(size);

                          return (
                            <div
                              key={size}
                              className={`
                                h-8 min-w-[2rem] px-2 rounded cursor-pointer flex items-center justify-center
                                ${
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }
                              `}
                              onClick={() => handleSizeChange(size)}
                            >
                              {size}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Button className="w-full" onClick={applyFilters}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Main component with Suspense
export default function ProductFilters() {
  return (
    <Suspense
      fallback={
        <div className="h-12 bg-muted/20 animate-pulse rounded-md"></div>
      }
    >
      <ProductFiltersContent />
    </Suspense>
  );
}
