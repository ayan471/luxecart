"use client";

import type React from "react";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function UserProfileInfo() {
  const { user, isLoaded } = useUser();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Initialize form data when user data is loaded
  useState(() => {
    if (isLoaded && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.phoneNumbers[0]?.phoneNumber || "",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // In a real app, you would update the user profile here
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user profile using Clerk
      if (user) {
        await user.update({
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      }

      toast.success("Profile updated", {
        description: "Your profile information has been updated successfully.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Update failed", {
        description:
          "There was an error updating your profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={user?.imageUrl || "/placeholder.svg"}
            alt={user?.fullName || "User"}
          />
          <AvatarFallback>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h3 className="text-2xl font-bold">{user?.fullName || "User"}</h3>
          <p className="text-muted-foreground">
            Member since{" "}
            {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>

        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          {isEditing ? (
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          ) : (
            <p className="text-sm">{user?.firstName || "—"}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          {isEditing ? (
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          ) : (
            <p className="text-sm">{user?.lastName || "—"}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          {isEditing ? (
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={true}
              title="Email cannot be changed here. Please use the account settings."
            />
          ) : (
            <p className="text-sm">
              {user?.primaryEmailAddress?.emailAddress || "—"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          {isEditing ? (
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={true}
              title="Phone number cannot be changed here. Please use the account settings."
            />
          ) : (
            <p className="text-sm">
              {user?.phoneNumbers[0]?.phoneNumber || "—"}
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-4">Account Management</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => window.open("/account/security", "_self")}
          >
            Security Settings
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/account/preferences", "_self")}
          >
            Preferences
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("/account/addresses", "_self")}
          >
            Manage Addresses
          </Button>
        </div>
      </div>
    </div>
  );
}
