"use client";

import { useCallback } from "react";

import { DomainUser_DETAILED } from "@/entities/user";
import { clientCookies, isDeepEqual, useLocalStorage } from "@/shared/libs";

type AuthUser = {
  domainUser?: DomainUser_DETAILED;
  authToken: string;
  domainId: string;
};

type UseAuthUser = {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
  updateUser: (updatedFields: Partial<AuthUser>) => void;
  logout: () => void;
};

export function useAuthUser(): UseAuthUser {
  const [storedValue, setStoredValue] = useLocalStorage<AuthUser | null>(
    "auth-user",
    null
  );

  const setAuthUser = useCallback(
    (user: AuthUser | null) => {
      if (!user || isDeepEqual(storedValue, user)) return;

      setStoredValue((prev) => (isDeepEqual(prev, user) ? prev : user));

      clientCookies.set("authToken", `${user?.authToken ?? ""}`, { path: "/" });
      clientCookies.set("domainId", `${user?.domainId ?? ""}`, { path: "/" });
      clientCookies.set("userId", `${user?.domainUser?.userId ?? ""}`, {
        path: "/",
      });
    },
    [setStoredValue, storedValue]
  );

  const updateUser = useCallback(
    (updatedFields: Partial<AuthUser>) => {
      if (storedValue) {
        const updatedUser = { ...storedValue, ...updatedFields };
        setStoredValue(updatedUser);
      }
    },
    [storedValue, setStoredValue]
  );

  const logout = useCallback(() => {
    setStoredValue(null);
    clientCookies.remove("authToken");
    clientCookies.remove("domainId");
    clientCookies.remove("userId");
  }, [setStoredValue]);

  return {
    authUser: storedValue,
    setAuthUser,
    updateUser,
    logout,
  };
}
