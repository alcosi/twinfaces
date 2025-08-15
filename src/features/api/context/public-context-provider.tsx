"use client";

import React from "react";

import { UserApi, createUserApi } from "@/entities/user";
import { ApiSettings, PublicApiContext, TwinsAPI } from "@/shared/api";
import { clientCookies } from "@/shared/libs";

export interface PublicApiContextProps {
  user: UserApi;
}

export function PublicApiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let authToken = "";
  let domainId = "";

  if (typeof document !== "undefined") {
    authToken = clientCookies.get("authToken") ?? "";
    domainId = clientCookies.get("domainId") ?? "";
  }

  const settings: ApiSettings = {
    authToken: authToken,
    domain: domainId,
    channel: "WEB",
    client: TwinsAPI,
  };

  return (
    <PublicApiContext.Provider
      value={{
        user: createUserApi(settings),
      }}
    >
      {children}
    </PublicApiContext.Provider>
  );
}
