"use client";

import { useCallback } from "react";

import { clientCookies } from "@/shared/libs";

type AuthUser = {
  userId?: string;
  authToken: string;
  domainId: string;
};

type UseAuthUser = {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export function useAuthUser(): UseAuthUser {
  const getAuthUser = (): AuthUser | null => {
    if (typeof document === "undefined") return null;

    const authToken = clientCookies.get("authToken");
    const domainId = clientCookies.get("domainId");
    const userId = clientCookies.get("userId");

    if (!authToken || !domainId) return null;

    return { authToken, domainId, userId };
  };

  const setAuthUser = useCallback((user: AuthUser | null) => {
    if (user) {
      clientCookies.set("authToken", `${user?.authToken}`, { path: "/" });
      clientCookies.set("domainId", `${user?.domainId}`, { path: "/" });
      clientCookies.set("userId", `${user?.userId}`, { path: "/" });
    }
  }, []);

  const logout = useCallback(() => {
    clientCookies.remove("authToken");
    clientCookies.remove("domainId");
    clientCookies.remove("userId");
  }, []);

  return {
    authUser: getAuthUser(),
    setAuthUser,
    logout,
  };
}
