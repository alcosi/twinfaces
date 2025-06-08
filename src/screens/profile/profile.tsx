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
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Impedit
            eius autem natus reprehenderit obcaecati, quidem ipsa cupiditate
            temporibus repellat fugiat veritatis enim, tempora quod deserunt
            laudantium earum nemo minima corrupti?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
