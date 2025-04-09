import { ReactNode } from "react";

import { UserContextProvider } from "@/features/user";

type UserLayoutProps = {
  params: {
    userId: string;
  };
  children: ReactNode;
};

export default function UserLayout({
  params: { userId },
  children,
}: UserLayoutProps) {
  return <UserContextProvider userId={userId}>{children}</UserContextProvider>;
}
