"use client";

import { useCallback, useEffect } from "react";

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

  useEffect(() => {
    console.log("🔥🔥🔥 storedValue changed", storedValue);
  }, [storedValue]);

  const setAuthUser = useCallback(
    (user: AuthUser | null) => {
      if (!user || isDeepEqual(storedValue, user)) return;
      console.log("🔥🔥🔥 setAuthUser", user);
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
      console.log("🔥🔥🔥 updateUser", updatedFields);
      if (storedValue) {
        const updatedUser = { ...storedValue, ...updatedFields };
        setStoredValue(updatedUser);
      }
    },
    [storedValue, setStoredValue]
  );

  const logout = useCallback(() => {
    console.log("🔥🔥🔥 logout");
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
