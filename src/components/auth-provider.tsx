"use client";

import type React from "react";
import { createContext, useContext } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";

type AuthContextType = {
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId } = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const isLoading = !isLoaded || !isUserLoaded;

  // Clerk handles authentication via its components, but we'll provide these methods
  // for compatibility with the existing code
  const login = async (email: string, password: string) => {
    // This is handled by Clerk's SignIn component
    throw new Error("Use Clerk's SignIn component instead");
  };

  const signup = async (email: string, password: string) => {
    // This is handled by Clerk's SignUp component
    throw new Error("Use Clerk's SignUp component instead");
  };

  const logout = async () => {
    // This is handled by Clerk's UserButton component or useClerkAuth().signOut()
    window.location.href = "/sign-out";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
