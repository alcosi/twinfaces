"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import { DomainUser, useFetchUserById } from "@/entities/user";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type UserContextProps = {
  userId: string;
  user: DomainUser;
  refresh: () => Promise<void>;
};

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

export function UserContextProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [userId]);

  const [user, setUser] = useState<DomainUser | undefined>(undefined);
  const { fetchUserById, loading } = useFetchUserById();

  async function refresh() {
    try {
      const fetchUser = await fetchUserById(userId);

      if (fetchUser) {
        setUser(fetchUser);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  if (isUndefined(user) || loading) return <LoadingOverlay />;

  return (
    <UserContext.Provider value={{ userId, user, refresh }}>
      {children}
    </UserContext.Provider>
  );
}
