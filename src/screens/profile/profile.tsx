"use client";

import { User } from "lucide-react";

import { useAuthUser } from "@/features/auth";

export default function ProfileScreen() {
  const { authUser } = useAuthUser();
  console.log(authUser?.userName);
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div className="border-border bg-secondary text-secondary-foreground flex h-16 items-center border-b px-6 shadow-sm">
        <h1 className="text-xl font-semibold">Profile Page</h1>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="border-border bg-card text-card-foreground w-full max-w-sm space-y-4 rounded-2xl border p-8 text-center shadow-lg">
          <div className="flex justify-center">
            <User className="text-brand-500 h-16 w-16" />
          </div>
          <h2 className="text-2xl font-semibold">{authUser?.userName}</h2>
          <p className="text-muted-foreground">Description</p>
        </div>
      </div>
    </div>
  );
}
