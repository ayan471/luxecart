"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OrderHistory from "@/components/order-history";
import WishlistItems from "@/components/wishlist-items";
import UserProfileInfo from "@/components/user-profile-info";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

import OrderAnalytics from "@/components/order-analytics";

export default function AccountPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [securityStatus, setSecurityStatus] = useState<
    "success" | "warning" | null
  >(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login?redirect_url=/account");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    // Simulate security check
    if (isSignedIn && user) {
      // Check if user has 2FA enabled
      const has2FA = user.totpEnabled;

      if (has2FA) {
        setSecurityStatus("success");
      } else {
        setSecurityStatus("warning");
      }
    }
  }, [isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate loyalty tier based on order count
  const orderCount = 5; // This would come from actual order data
  const loyaltyTier =
    orderCount >= 10 ? "Gold" : orderCount >= 5 ? "Silver" : "Bronze";
  const nextTier =
    loyaltyTier === "Gold"
      ? null
      : loyaltyTier === "Silver"
      ? "Gold"
      : "Silver";
  const progress =
    loyaltyTier === "Gold"
      ? 100
      : loyaltyTier === "Silver"
      ? (orderCount / 10) * 100
      : (orderCount / 5) * 100;
  const ordersToNextTier =
    loyaltyTier === "Gold"
      ? 0
      : loyaltyTier === "Silver"
      ? 10 - orderCount
      : 5 - orderCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-start h-auto bg-transparent space-y-1">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  Order History
                </Button>
                <Button
                  variant={activeTab === "analytics" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("analytics")}
                >
                  Order Analytics
                </Button>
                <Button
                  variant={activeTab === "wishlist" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("wishlist")}
                >
                  Wishlist
                </Button>
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("security")}
                >
                  Security
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Loyalty Status</CardTitle>
              <CardDescription>{loyaltyTier} Member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="h-2" />

                {nextTier && (
                  <p className="text-sm text-muted-foreground">
                    {ordersToNextTier} more orders until {nextTier} tier
                  </p>
                )}

                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Benefits:</p>
                  <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                    {loyaltyTier === "Bronze" && (
                      <>
                        <li>• Free shipping on orders over $50</li>
                        <li>• Birthday discount: 5% off</li>
                      </>
                    )}
                    {loyaltyTier === "Silver" && (
                      <>
                        <li>• Free shipping on all orders</li>
                        <li>• Birthday discount: 10% off</li>
                        <li>• Early access to sales</li>
                      </>
                    )}
                    {loyaltyTier === "Gold" && (
                      <>
                        <li>• Free shipping on all orders</li>
                        <li>• Birthday discount: 15% off</li>
                        <li>• Early access to sales</li>
                        <li>• Exclusive products</li>
                        <li>• Dedicated customer service</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  View and update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfileInfo />
              </CardContent>
            </Card>
          )}

          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View your past orders and their status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderHistory />
              </CardContent>
            </Card>
          )}

          {activeTab === "analytics" && (
            <Card>
              <CardHeader>
                <CardTitle>Order Analytics</CardTitle>
                <CardDescription>
                  Visualize your shopping patterns and history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderAnalytics />
              </CardContent>
            </Card>
          )}

          {activeTab === "wishlist" && (
            <Card>
              <CardHeader>
                <CardTitle>Your Wishlist</CardTitle>
                <CardDescription>
                  Items you&apos;ve saved for later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WishlistItems />
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication methods.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {securityStatus === "success" && (
                  <Alert variant="default">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Your account is secure</AlertTitle>
                    <AlertDescription>
                      You have enabled two-factor authentication, keeping your
                      account protected.
                    </AlertDescription>
                  </Alert>
                )}

                {securityStatus === "warning" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Enhance your account security</AlertTitle>
                    <AlertDescription>
                      We recommend enabling two-factor authentication for
                      additional protection.
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account by enabling
                    two-factor authentication.
                  </p>
                  <UserProfile
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 p-0",
                        navbar: "hidden",
                        navbarMobileMenuButton: "hidden",
                        pageScrollBox: "p-0",
                      },
                    }}
                  />
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    It&apos;s a good idea to use a strong password that you
                    don&apos;t use elsewhere.
                  </p>
                  <Button>Change Password</Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-2">Login Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    These are the devices that have logged into your account.
                    Revoke any sessions that you don&apos;t recognize.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Last active: Just now
                        </p>
                      </div>
                      <Button variant="outline" disabled>
                        Current
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">
                          Last active: 2 days ago
                        </p>
                      </div>
                      <Button variant="outline">Revoke</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
