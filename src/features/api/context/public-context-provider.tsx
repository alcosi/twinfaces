"use client";

import React, { useEffect, useMemo } from "react";

import { UserApi, createUserApi } from "@/entities/user";
import { ApiSettings, PublicApiContext, TwinsAPI } from "@/shared/api";

import { useAuthUser } from "../../auth";

export interface PublicApiContextProps {
  user: UserApi;
}

export function PublicApiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser, isLoading } = useAuthUser();

  const shouldRender = authUser && !isLoading;

  useEffect(() => {
    console.log("✅------------PublicApiContextProvider mounted");
    console.log("------------authUser", authUser);

    return () => {
      console.log("❌------------PublicApiContextProvider unmounted");
    };
  });

  const settings: ApiSettings = useMemo(
    () => ({
      authToken: authUser?.authToken ?? "",
      domain: authUser?.domainId ?? "",
      channel: "WEB",
      client: TwinsAPI,
    }),
    [authUser?.authToken, authUser?.domainId]
  );

  const value = useMemo(
    () => ({
      user: createUserApi(settings),
    }),
    [settings]
  );

  if (!shouldRender) {
    return null;
  }

  return (
    <PublicApiContext.Provider value={value}>
      {children}
    </PublicApiContext.Provider>
  );
}
