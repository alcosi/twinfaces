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
  const { authUser } = useAuthUser();

  useEffect(() => {
    console.log("✅------------PublicApiContextProvider mounted");

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

  return (
    <PublicApiContext.Provider value={value}>
      {children}
    </PublicApiContext.Provider>
  );
}
