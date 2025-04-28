import type React from "react";
export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-muted/20">{children}</div>;
}
