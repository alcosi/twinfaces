"use client";

import { createFeaturerApi, FeaturerApi } from "@/entities/featurer";
import { createPermissionApi, PermissionApi } from "@/entities/permission";
import {
  createPermissionGroupApi,
  PermissionGroupApi,
} from "@/entities/permissionGroup";
import { createTwinApi, TwinApi } from "@/entities/twin";
import { createTwinClassApi, TwinClassApi } from "@/entities/twinClass";
import {
  createTwinClassLinksApi,
  TwinClassLinkApi,
} from "@/entities/twinClassLink";
import { createTwinStatusApi, TwinStatusApi } from "@/entities/twinClassStatus";
import { createTwinflowApi, TwinflowApi } from "@/entities/twinFlow";
import {
  createTwinFlowTransitionApi,
  TwinFlowTransitionApi,
} from "@/entities/twinFlowTransition";
import { ApiContext, ApiSettings } from "@/shared/api";
import { paths } from "@/shared/api/generated/schema";
import { env } from "next-runtime-env";
import createClient from "openapi-fetch";
import React from "react";
import { createDatalistApi, DatalistApi } from "@/entities/datalist";

export interface ApiContextProps {
  twinClass: TwinClassApi;
  twinStatus: TwinStatusApi;
  twinflow: TwinflowApi;
  twinFlowTransition: TwinFlowTransitionApi;
  featurer: FeaturerApi;
  twin: TwinApi;
  twinClassLink: TwinClassLinkApi;
  permission: PermissionApi;
  permissionGroup: PermissionGroupApi;
  datalist: DatalistApi;
}

export function ApiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings: ApiSettings = {
    domain: env("NEXT_PUBLIC_DOMAIN") ?? "",
    authToken: env("NEXT_PUBLIC_AUTH_TOKEN") ?? "",
    channel: env("NEXT_PUBLIC_CHANNEL") ?? "",
    client: createClient<paths>({ baseUrl: env("NEXT_PUBLIC_TWINS_API_URL") }),
  };

  return (
    <ApiContext.Provider
      value={{
        twinClass: createTwinClassApi(settings),
        twinStatus: createTwinStatusApi(settings),
        twinflow: createTwinflowApi(settings),
        twinFlowTransition: createTwinFlowTransitionApi(settings),
        featurer: createFeaturerApi(settings),
        twin: createTwinApi(settings),
        twinClassLink: createTwinClassLinksApi(settings),
        permission: createPermissionApi(settings),
        permissionGroup: createPermissionGroupApi(settings),
        datalist: createDatalistApi(settings),
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
