"use client";

import React from "react";

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

  const settings: ApiSettings = {
    authToken: authUser?.authToken ?? "",
    domain: authUser?.domainId ?? "",
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
