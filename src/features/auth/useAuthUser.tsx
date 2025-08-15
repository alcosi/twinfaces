"use client";

import { DomainUser_DETAILED } from "@/entities/user";
import { clientCookies } from "@/shared/libs";

type AuthUser = {
  domainUser?: DomainUser_DETAILED;
  authToken: string;
  domainId: string;
};

type UseAuthUser = {
  setAuthUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export function useAuthUser(): UseAuthUser {
  const setAuthUser = (user: AuthUser | null) => {
    clientCookies.set("authToken", `${user?.authToken}`, { path: "/" });
    clientCookies.set("domainId", `${user?.domainId}`, { path: "/" });
    clientCookies.set("userId", `${user?.domainUser?.userId}`, { path: "/" });
  };

  const logout = () => {
    clientCookies.remove("authToken");
    clientCookies.remove("domainId");
    clientCookies.remove("userId");
  };

  return {
    setAuthUser,
    logout,
  };
}
