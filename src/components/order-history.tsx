"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

type OrderItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: number;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
};

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Simulate fetching order history
    const fetchOrders = async () => {
      setIsLoading(true);

      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockOrders: Order[] = [
          {
            id: 1001,
            date: "2023-04-15T14:30:00Z",
            status: "delivered",
            total: 129.95,
            items: [
              {
                id: 1,
                title: "Fjallraven - Foldsack No. 1 Backpack",
                price: 109.95,
                quantity: 1,
                image:
                  "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
              },
              {
                id: 2,
                title: "Mens Casual Premium Slim Fit T-Shirts",
                price: 22.3,
                quantity: 1,
                image:
                  "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
              },
            ],
            trackingNumber: "TRK123456789",
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "San Francisco",
              state: "CA",
              zipCode: "94103",
              country: "USA",
            },
          },
          {
            id: 1002,
            date: "2023-05-20T10:15:00Z",
            status: "shipped",
            total: 55.99,
            items: [
              {
                id: 3,
                title: "Mens Cotton Jacket",
                price: 55.99,
                quantity: 1,
                image:
                  "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
              },
            ],
            trackingNumber: "TRK987654321",
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "San Francisco",
              state: "CA",
              zipCode: "94103",
              country: "USA",
            },
          },
          {
            id: 1003,
            date: "2023-06-10T16:45:00Z",
            status: "processing",
            total: 114.0,
            items: [
              {
                id: 4,
                title: "Mens Casual Slim Fit",
                price: 15.99,
                quantity: 2,
                image:
                  "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
              },
              {
                id: 5,
                title:
                  "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
                price: 695.0,
                quantity: 1,
                image:
                  "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
              },
            ],
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "San Francisco",
              state: "CA",
              zipCode: "94103",
              country: "USA",
            },
          },
          {
            id: 1004,
            date: "2023-07-05T09:20:00Z",
            status: "cancelled",
            total: 109.95,
            items: [
              {
                id: 1,
                title: "Fjallraven - Foldsack No. 1 Backpack",
                price: 109.95,
                quantity: 1,
                image:
                  "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
              },
            ],
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "San Francisco",
              state: "CA",
              zipCode: "94103",
              country: "USA",
            },
          },
        ];

        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Filter by status
      if (statusFilter !== "all" && order.status !== statusFilter) {
        return false;
      }

      // Filter by tab
      if (
        activeTab === "recent" &&
        new Date(order.date).getTime() < Date.now() - 30 * 24 * 60 * 60 * 1000
      ) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const hasMatchingItem = order.items.some((item) =>
          item.title.toLowerCase().includes(searchLower)
        );
        return (
          order.id.toString().includes(searchLower) ||
          hasMatchingItem ||
          order.trackingNumber?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-4">
          When you place orders, they will appear here.
        </p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="recent">Recent (30 days)</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Filter className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No orders match your filters.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            renderOrderList(filteredOrders)
          )}
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          {filteredOrders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Package className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  No recent orders in the last 30 days.
                </p>
                <Button variant="link" asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            renderOrderList(filteredOrders)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderOrderList(orders: Order[]) {
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border overflow-hidden"
          >
            <div
              className="bg-muted/50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 cursor-pointer"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Order #{order.id}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(order.date), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm font-medium">
                  ${order.total.toFixed(2)}
                </div>

                <Badge className={`${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>

                {expandedOrderId === order.id ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {expandedOrderId === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Shipping Address
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>{order.shippingAddress.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Order Details
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Order Date:{" "}
                            {format(new Date(order.date), "MMMM d, yyyy")}
                          </p>
                          <p>
                            Order Status:{" "}
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </p>
                          {order.trackingNumber && (
                            <p>Tracking Number: {order.trackingNumber}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-sm font-medium mb-2">Items</h4>
                    {order.items.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-center gap-4 py-2">
                          <div className="w-12 h-12 bg-muted/20 rounded-md relative overflow-hidden flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {item.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">
                              ${item.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        {index < order.items.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted/30 p-4 flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/account/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>

                    {(order.status === "shipped" ||
                      order.status === "processing") && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/account/orders/${order.id}/track`}>
                          Track Order
                        </Link>
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    );
  }
}
