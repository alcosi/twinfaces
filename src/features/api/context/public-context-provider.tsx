"use client";

import { env } from "next-runtime-env";
import createClient from "openapi-fetch";
import React from "react";

import { PublicDomainApi, createPublicDomainApi } from "@/entities/domain";
import { UserApi, createUserApi } from "@/entities/user";
import { ApiSettings, PublicApiContext } from "@/shared/api";
import { paths } from "@/shared/api/generated/schema";

import { useAuthUser } from "../../auth";

export interface PublicApiContextProps {
  user: UserApi;
  publicDomain: PublicDomainApi;
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
    client: createClient<paths>({ baseUrl: env("NEXT_PUBLIC_TWINS_API_URL") }),
  };

  return (
    <PublicApiContext.Provider
      value={{
        user: createUserApi(settings),
        publicDomain: createPublicDomainApi(settings),
      }}
    >
      {children}
    </PublicApiContext.Provider>
  );
}
