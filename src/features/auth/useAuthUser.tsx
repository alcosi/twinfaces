"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [authUser, setAuthUserState] = useState<AuthUser | null>(storedValue);

  useEffect(() => {
    setAuthUserState((prev) =>
      isDeepEqual(prev, storedValue) ? prev : storedValue
    );
  }, [storedValue]);

  const memoizedAuthUser = useMemo(() => authUser, [JSON.stringify(authUser)]);

  const setAuthUser = useCallback(
    (user: AuthUser | null) => {
      setStoredValue(user);
      clientCookies.set("authToken", `${user?.authToken}`, { path: "/" });
      clientCookies.set("domainId", `${user?.domainId}`, { path: "/" });
      clientCookies.set("userId", `${user?.domainUser?.userId}`, { path: "/" });
    },
    [setStoredValue]
  );

  const updateUser = useCallback(
    (updatedFields: Partial<AuthUser>) => {
      if (authUser) {
        const updatedUser = { ...authUser, ...updatedFields };
        setStoredValue(updatedUser);
      }
    },
    [authUser, setStoredValue]
  );

  const logout = useCallback(() => {
    setStoredValue(null);
    clientCookies.remove("authToken");
    clientCookies.remove("domainId");
    clientCookies.remove("userId");
  }, [setStoredValue]);

  return {
    authUser: memoizedAuthUser,
    setAuthUser,
    updateUser,
    logout,
  };
}
