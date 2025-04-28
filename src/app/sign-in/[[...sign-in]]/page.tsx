"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  // Client component to access search params
  return <LoginPageClient />;
}

// Client component to handle redirect
function LoginPageClient() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-none border rounded-lg p-6",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-muted-foreground",
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-primary-foreground",
            formFieldLabel: "text-foreground font-medium",
            formFieldInput: "border rounded-md p-2 w-full",
            footerAction: "text-primary hover:text-primary/90",
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        redirectUrl={redirectUrl}
      />
    </div>
  );
}
