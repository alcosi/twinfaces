import { ReactNode } from "react";

import { UserContextProvider } from "@/features/user";

type UserLayoutProps = {
  params: Promise<{
    userId: string;
  }>;
  children: ReactNode;
};

export default async function UserLayout(props: UserLayoutProps) {
  const params = await props.params;

  const { userId } = params;

  const { children } = props;

  return <UserContextProvider userId={userId}>{children}</UserContextProvider>;
}
