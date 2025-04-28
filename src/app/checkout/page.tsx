"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import { CheckCircle2, CreditCard, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import confetti from "canvas-confetti";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Encode the redirect URL properly
      const encodedRedirect = encodeURIComponent("/checkout");
      router.push(`/sign-in?redirect_url=${encodedRedirect}`);
    }

    if (isLoaded && isSignedIn && user) {
      // Pre-fill email if available
      setFormData((prev) => ({
        ...prev,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }));
    }
  }, [isLoaded, isSignedIn, user, router]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (step === 1) {
      const {
        firstName,
        lastName,
        email,
        address,
        city,
        state,
        zipCode,
        country,
      } = formData;

      if (!firstName) {
        newErrors.firstName = "First name is required";
        isValid = false;
      }

      if (!lastName) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      }

      if (!email) {
        newErrors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email is invalid";
        isValid = false;
      }

      if (!address) {
        newErrors.address = "Address is required";
        isValid = false;
      }

      if (!city) {
        newErrors.city = "City is required";
        isValid = false;
      }

      if (!state) {
        newErrors.state = "State is required";
        isValid = false;
      }

      if (!zipCode) {
        newErrors.zipCode = "ZIP code is required";
        isValid = false;
      }

      if (!country) {
        newErrors.country = "Country is required";
        isValid = false;
      }
    }

    if (step === 2) {
      if (paymentMethod === "credit-card") {
        const { cardName, cardNumber, expiryDate, cvv } = formData;

        if (!cardName) {
          newErrors.cardName = "Name on card is required";
          isValid = false;
        }

        if (!cardNumber) {
          newErrors.cardNumber = "Card number is required";
          isValid = false;
        } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
          newErrors.cardNumber = "Card number must be 16 digits";
          isValid = false;
        }

        if (!expiryDate) {
          newErrors.expiryDate = "Expiry date is required";
          isValid = false;
        } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
          newErrors.expiryDate = "Use format MM/YY";
          isValid = false;
        }

        if (!cvv) {
          newErrors.cvv = "CVV is required";
          isValid = false;
        } else if (!/^\d{3,4}$/.test(cvv)) {
          newErrors.cvv = "CVV must be 3 or 4 digits";
          isValid = false;
        }
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate random order number
    const generatedOrderNumber = `ORD-${Math.floor(
      100000 + Math.random() * 900000
    )}`;
    setOrderNumber(generatedOrderNumber);

    // Clear cart and show success
    clearCart();
    setIsSubmitting(false);
    setCurrentStep(3);

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cart.length === 0 && currentStep !== 3) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
            <h1 className="text-3xl font-bold">Checkout</h1>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <div
                className={`w-16 h-1 ${
                  currentStep >= 2 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <div
                className={`w-16 h-1 ${
                  currentStep >= 3 ? "bg-primary" : "bg-muted"
                }`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                3
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {currentStep === 1 && "Step 1: Shipping Information"}
            {currentStep === 2 && "Step 2: Payment Method"}
            {currentStep === 3 && "Step 3: Order Confirmation"}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={formErrors.firstName ? "border-red-500" : ""}
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={formErrors.lastName ? "border-red-500" : ""}
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={formErrors.address ? "border-red-500" : ""}
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={formErrors.city ? "border-red-500" : ""}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={formErrors.state ? "border-red-500" : ""}
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.state}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={formErrors.zipCode ? "border-red-500" : ""}
                      />
                      {formErrors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.zipCode}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={formErrors.country ? "border-red-500" : ""}
                      />
                      {formErrors.country && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.country}
                        </p>
                      )}
                    </div>
                  </div>

                  {Object.keys(formErrors).length > 0 && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please fix the errors above to continue.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleNextStep}>
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-2 border rounded-md p-3 mb-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label
                        htmlFor="credit-card"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <CreditCard className="h-5 w-5" />
                        Credit/Debit Card
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-md p-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer">
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={
                            formErrors.cardName ? "border-red-500" : ""
                          }
                        />
                        {formErrors.cardName && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.cardName}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className={
                            formErrors.cardNumber ? "border-red-500" : ""
                          }
                        />
                        {formErrors.cardNumber && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className={
                              formErrors.expiryDate ? "border-red-500" : ""
                            }
                          />
                          {formErrors.expiryDate && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className={formErrors.cvv ? "border-red-500" : ""}
                          />
                          {formErrors.cvv && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.cvv}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {Object.keys(formErrors).length > 0 && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please fix the errors above to continue.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                    <Button onClick={handleSubmitOrder} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground mb-8">
                Thank you for your purchase. Your order has been received and is
                being processed.
              </p>

              <div className="max-w-md mx-auto bg-muted/30 rounded-lg p-4 mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-medium">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Estimated Delivery:
                  </span>
                  <span className="font-medium">
                    {new Date(
                      Date.now() + 7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/account/orders")}
                >
                  View Order
                </Button>
                <Button onClick={() => router.push("/products")}>
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep !== 3 && (
          <div className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 relative overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (7%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <Separator className="my-2" />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
