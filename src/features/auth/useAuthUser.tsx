"use client";

import { useCallback, useEffect, useState } from "react";

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
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null);

  useEffect(() => {
    const authToken = clientCookies.get("authToken");
    const domainId = clientCookies.get("domainId");
    const userId = clientCookies.get("userId");

    setAuthUserState({
      authToken: authToken ?? "",
      domainId: domainId ?? "",
      userId: userId ?? "",
    });
  }, []);

  const setAuthUser = useCallback((user: AuthUser | null) => {
    setAuthUserState(user);

    if (user) {
      clientCookies.set("authToken", `${user?.authToken}`, { path: "/" });
      clientCookies.set("domainId", `${user?.domainId}`, { path: "/" });
      clientCookies.set("userId", `${user?.userId}`, { path: "/" });
    }
  }, []);

  const logout = useCallback(() => {
    setAuthUserState(null);
    clientCookies.remove("authToken");
    clientCookies.remove("domainId");
    clientCookies.remove("userId");
  }, []);

  return {
    authUser,
    setAuthUser,
    logout,
  };
}
