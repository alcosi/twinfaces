"use client";

import { User } from "lucide-react";

import { useAuthUser } from "@/features/auth";
import { Card, CardContent, CardHeader } from "@/shared/ui";

export function ProfileScreen() {
  const { authUser } = useAuthUser();

  return (
    <div className="mt-16 flex h-full justify-center">
      <Card className="flex h-96 w-96 flex-col items-center justify-center text-center">
        <User className="text-brand-500 h-16 w-16" />
        <CardHeader>
          <h2 className="text-2xl font-semibold">
            {authUser?.domainUser?.user.fullName}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to On Shelves – Your Central Hub for Managing Sales on
            Amazon and Allegro Take full control of your online sales with our
            smart platform that brings together the most essential features of
            Amazon and Allegro in one place. Our marketplace aggregator enables
            intuitive offer management, content optimization tailored to each
            platform’s requirements, and synchronization of optimization results
            across sales channels. Everything works smoothly and clearly – just
            like a well-organized shelf.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
