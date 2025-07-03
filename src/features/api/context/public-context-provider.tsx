"use client";

import React, { useEffect, useMemo } from "react";

import { UserApi, createUserApi } from "@/entities/user";
import { ApiSettings, PublicApiContext, TwinsAPI } from "@/shared/api";

import { useAuthCookies } from "./use-auth-cookies";

export interface PublicApiContextProps {
  user: UserApi;
}

export function PublicApiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authToken, domainId, isReady } = useAuthCookies();

  useEffect(() => {
    console.log(
      "🔄 PublicApiContextProvider authUser changed",
      authToken,
      domainId
    );
  }, [authToken, domainId]);

  useEffect(() => {
    console.log("✅------------PublicApiContextProvider mounted");

    return () => {
      console.log("❌------------PublicApiContextProvider unmounted");
    };
  });

  const settings: ApiSettings = useMemo(
    () => ({
      authToken: authToken ?? "",
      domain: domainId ?? "",
      channel: "WEB",
      client: TwinsAPI,
    }),
    [authToken, domainId]
  );

  const value = useMemo(
    () => ({
      user: createUserApi(settings),
    }),
    [settings]
  );

  if (!isReady) return null;

  return (
    <PublicApiContext.Provider value={value}>
      {children}
    </PublicApiContext.Provider>
  );
}
