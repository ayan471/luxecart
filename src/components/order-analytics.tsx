"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subMonths, subYears, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import Chart.js
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

type OrderData = {
  date: string;
  amount: number;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  category: string;
};

export default function OrderAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("6months");
  const [chartType, setChartType] = useState("spending");
  const spendingChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const [spendingChart, setSpendingChart] = useState<Chart | null>(null);
  const [categoryChart, setCategoryChart] = useState<Chart | null>(null);
  const [statusChart, setStatusChart] = useState<Chart | null>(null);
  const [orderData, setOrderData] = useState<OrderData[]>([]);

  // Generate mock data
  useEffect(() => {
    const generateMockData = () => {
      setIsLoading(true);

      // Generate dates based on selected time range
      const endDate = new Date();
      let startDate: Date;

      switch (timeRange) {
        case "30days":
          startDate = subMonths(endDate, 1);
          break;
        case "3months":
          startDate = subMonths(endDate, 3);
          break;
        case "6months":
          startDate = subMonths(endDate, 6);
          break;
        case "1year":
          startDate = subYears(endDate, 1);
          break;
        default:
          startDate = subMonths(endDate, 6);
      }

      // Generate random order data
      const categories = ["Electronics", "Clothing", "Jewelry", "Home Goods"];
      const statuses = [
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ] as const;

      const mockData: OrderData[] = [];

      // Generate one order every 5-15 days
      let currentDate = startDate;
      while (currentDate <= endDate) {
        // Random order data
        const category =
          categories[Math.floor(Math.random() * categories.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const amount = Math.floor(Math.random() * 200) + 20; // Random amount between $20 and $220

        mockData.push({
          date: currentDate.toISOString(),
          amount,
          status,
          category,
        });

        // Add 5-15 days for next order
        const daysToAdd = Math.floor(Math.random() * 10) + 5;
        currentDate = new Date(
          currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000
        );
      }

      setOrderData(mockData);
      setIsLoading(false);
    };

    generateMockData();
  }, [timeRange]);

  // Create and update charts when data changes
  useEffect(() => {
    if (isLoading || !orderData.length) return;

    // Destroy previous charts if they exist
    if (spendingChart) spendingChart.destroy();
    if (categoryChart) categoryChart.destroy();
    if (statusChart) statusChart.destroy();

    // Prepare data for spending chart
    const spendingByMonth: Record<string, number> = {};
    orderData.forEach((order) => {
      const date = parseISO(order.date);
      const monthYear = format(date, "MMM yyyy");

      if (!spendingByMonth[monthYear]) {
        spendingByMonth[monthYear] = 0;
      }

      spendingByMonth[monthYear] += order.amount;
    });

    // Prepare data for category chart
    const spendingByCategory: Record<string, number> = {};
    orderData.forEach((order) => {
      if (!spendingByCategory[order.category]) {
        spendingByCategory[order.category] = 0;
      }

      spendingByCategory[order.category] += order.amount;
    });

    // Prepare data for status chart
    const ordersByStatus: Record<string, number> = {};
    orderData.forEach((order) => {
      if (!ordersByStatus[order.status]) {
        ordersByStatus[order.status] = 0;
      }

      ordersByStatus[order.status] += 1;
    });

    // Create spending chart
    if (spendingChartRef.current) {
      const ctx = spendingChartRef.current.getContext("2d");
      if (ctx) {
        const newSpendingChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: Object.keys(spendingByMonth),
            datasets: [
              {
                label: "Spending",
                data: Object.values(spendingByMonth),
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.3,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Spending Over Time",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: (value) => "$" + value,
                },
              },
            },
          },
        });
        setSpendingChart(newSpendingChart);
      }
    }

    // Create category chart
    if (categoryChartRef.current) {
      const ctx = categoryChartRef.current.getContext("2d");
      if (ctx) {
        const newCategoryChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: Object.keys(spendingByCategory),
            datasets: [
              {
                label: "Spending by Category",
                data: Object.values(spendingByCategory),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.7)",
                  "rgba(54, 162, 235, 0.7)",
                  "rgba(255, 206, 86, 0.7)",
                  "rgba(75, 192, 192, 0.7)",
                  "rgba(153, 102, 255, 0.7)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "right",
              },
              title: {
                display: true,
                text: "Spending by Category",
              },
            },
          },
        });
        setCategoryChart(newCategoryChart);
      }
    }

    // Create status chart
    if (statusChartRef.current) {
      const ctx = statusChartRef.current.getContext("2d");
      if (ctx) {
        const statusColors = {
          processing: "rgba(255, 206, 86, 0.7)",
          shipped: "rgba(54, 162, 235, 0.7)",
          delivered: "rgba(75, 192, 192, 0.7)",
          cancelled: "rgba(255, 99, 132, 0.7)",
        };

        const newStatusChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: Object.keys(ordersByStatus).map(
              (status) => status.charAt(0).toUpperCase() + status.slice(1)
            ),
            datasets: [
              {
                label: "Orders by Status",
                data: Object.values(ordersByStatus),
                backgroundColor: Object.keys(ordersByStatus).map(
                  (status) => statusColors[status as keyof typeof statusColors]
                ),
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: "Orders by Status",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          },
        });
        setStatusChart(newStatusChart);
      }
    }

    return () => {
      if (spendingChart) spendingChart.destroy();
      if (categoryChart) categoryChart.destroy();
      if (statusChart) statusChart.destroy();
    };
  }, [orderData, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2 mb-4">
          <Button
            variant={chartType === "spending" ? "default" : "outline"}
            onClick={() => setChartType("spending")}
          >
            Spending
          </Button>
          <Button
            variant={chartType === "categories" ? "default" : "outline"}
            onClick={() => setChartType("categories")}
          >
            Categories
          </Button>
          <Button
            variant={chartType === "status" ? "default" : "outline"}
            onClick={() => setChartType("status")}
          >
            Order Status
          </Button>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {chartType === "spending" && (
        <Card>
          <CardHeader>
            <CardTitle>Spending Over Time</CardTitle>
            <CardDescription>
              Track your purchase history and spending patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <canvas ref={spendingChartRef}></canvas>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted p-3">
                <div className="text-sm font-medium">Total Spent</div>
                <div className="text-2xl font-bold">
                  $
                  {orderData
                    .reduce((sum, order) => sum + order.amount, 0)
                    .toFixed(2)}
                </div>
              </div>

              <div className="rounded-lg bg-muted p-3">
                <div className="text-sm font-medium">Average Order</div>
                <div className="text-2xl font-bold">
                  $
                  {(
                    orderData.reduce((sum, order) => sum + order.amount, 0) /
                    orderData.length
                  ).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {chartType === "categories" && (
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              See which product categories you shop the most
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <canvas ref={categoryChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      )}

      {chartType === "status" && (
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Current status of all your orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <canvas ref={statusChartRef}></canvas>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
