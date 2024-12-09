"use client";

import { createDatalistApi, DatalistApi } from "@/entities/datalist";
import { createFeaturerApi, FeaturerApi } from "@/entities/featurer";
import { createPermissionApi, PermissionApi } from "@/entities/permission";
import {
  createPermissionGroupApi,
  PermissionGroupApi,
} from "@/entities/permissionGroup";
import { createTwinApi, TwinApi } from "@/entities/twin";
import { createTwinClassApi, TwinClassApi } from "@/entities/twinClass";
import {
  createTwinClassFieldApi,
  TwinClassFieldApi,
} from "@/entities/twinClassField";
import {
  createTwinClassLinksApi,
  TwinClassLinkApi,
} from "@/entities/twinClassLink";
import { createTwinFlowApi, TwinFlowApi } from "@/entities/twinFlow";
import {
  createTwinFlowSchemaApi,
  TwinFlowSchemaApi,
} from "@/entities/twinFlowSchema";
import {
  createTwinFlowTransitionApi,
  TwinFlowTransitionApi,
} from "@/entities/twinFlowTransition";
import { createTwinStatusApi, TwinStatusApi } from "@/entities/twinStatus";
import { createUserApi, UserApi } from "@/entities/user";
import { createUserGroupApi, UserGroupApi } from "@/entities/userGroup";
import { ApiContext, ApiSettings } from "@/shared/api";
import { paths } from "@/shared/api/generated/schema";
import { env } from "next-runtime-env";
import createClient from "openapi-fetch";
import React from "react";
import { CommentApi, createCommentApi } from "@/entities/comment";

export interface ApiContextProps {
  twinFlowSchema: TwinFlowSchemaApi;
  twinClassField: TwinClassFieldApi;
  twinClass: TwinClassApi;
  twinStatus: TwinStatusApi;
  twinFlow: TwinFlowApi;
  twinFlowTransition: TwinFlowTransitionApi;
  featurer: FeaturerApi;
  twin: TwinApi;
  twinClassLink: TwinClassLinkApi;
  permission: PermissionApi;
  permissionGroup: PermissionGroupApi;
  user: UserApi;
  userGroup: UserGroupApi;
  datalist: DatalistApi;
  comment: CommentApi;
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
        twinFlowSchema: createTwinFlowSchemaApi(settings),
        twinClassField: createTwinClassFieldApi(settings),
        twinClass: createTwinClassApi(settings),
        twinStatus: createTwinStatusApi(settings),
        twinFlow: createTwinFlowApi(settings),
        twinFlowTransition: createTwinFlowTransitionApi(settings),
        featurer: createFeaturerApi(settings),
        twin: createTwinApi(settings),
        twinClassLink: createTwinClassLinksApi(settings),
        permission: createPermissionApi(settings),
        permissionGroup: createPermissionGroupApi(settings),
        user: createUserApi(settings),
        userGroup: createUserGroupApi(settings),
        datalist: createDatalistApi(settings),
        comment: createCommentApi(settings),
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
