"use client";

import {
  createPermissionAssigneePropagationApi,
  PermissionAssigneePropagationApi,
} from "@/entities/assigneePropagation";
import { CommentApi, createCommentApi } from "@/entities/comment";
import { createDatalistApi, DatalistApi } from "@/entities/datalist";
import {
  createDatalistOptionApi,
  DatalistOptionApi,
} from "@/entities/datalist-option";
import { createDomainApi, DomainApi } from "@/entities/domain";
import { createFactoryApi, FactoryApi } from "@/entities/factory";
import {
  createFactoryBrancheApi,
  FactoryBrancheApi,
} from "@/entities/factory-branche";
import {
  createFactoryPipelineApi,
  FactoryPipelineApi,
} from "@/entities/factoryPipeline";
import { createFeaturerApi, FeaturerApi } from "@/entities/featurer";
import { createPermissionApi, PermissionApi } from "@/entities/permission";
import {
  createPermissionGroupApi,
  PermissionGroupApi,
} from "@/entities/permissionGroup";
import {
  createPermissionSchemaApi,
  PermissionSchemaApi,
} from "@/entities/permissionSchema";
import {
  createPermissionSpaceRoleApi,
  PermissionSpaceRoleApi,
} from "@/entities/spaceRole";
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
import {
  createPermissionTwinRoleApi,
  PermissionTwinRoleApi,
} from "@/entities/twinRole";
import { createTwinStatusApi, TwinStatusApi } from "@/entities/twin-status";
import { createUserApi, UserApi } from "@/entities/user";
import { createUserGroupApi, UserGroupApi } from "@/entities/userGroup";
import { ApiContext, ApiSettings } from "@/shared/api";
import { paths } from "@/shared/api/generated/schema";
import { env } from "next-runtime-env";
import createClient from "openapi-fetch";
import React from "react";
import { useAuthUser } from "../auth";
import {
  createPipelineStepApi,
  PipelineStepApi,
} from "@/entities/pipelineSteps/api";

export interface ApiContextProps {
  domain: DomainApi;
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
  permissionSchema: PermissionSchemaApi;
  user: UserApi;
  userGroup: UserGroupApi;
  datalist: DatalistApi;
  comment: CommentApi;
  twinRole: PermissionTwinRoleApi;
  assigneePropagation: PermissionAssigneePropagationApi;
  factory: FactoryApi;
  factoryPipeline: FactoryPipelineApi;
  factoryBranches: FactoryBrancheApi;
  pipelineSteps: PipelineStepApi;
  spaceRole: PermissionSpaceRoleApi;
  datalistOption: DatalistOptionApi;
}

export function ApiContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authUser } = useAuthUser();

  const settings: ApiSettings = {
    authToken: authUser?.authToken ?? env("NEXT_PUBLIC_AUTH_TOKEN") ?? "",
    domain: authUser?.domainId ?? env("NEXT_PUBLIC_DOMAIN") ?? "",
    channel: env("NEXT_PUBLIC_CHANNEL") ?? "",
    client: createClient<paths>({ baseUrl: env("NEXT_PUBLIC_TWINS_API_URL") }),
  };

  return (
    <ApiContext.Provider
      value={{
        domain: createDomainApi(settings),
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
        permissionSchema: createPermissionSchemaApi(settings),
        user: createUserApi(settings),
        userGroup: createUserGroupApi(settings),
        datalist: createDatalistApi(settings),
        comment: createCommentApi(settings),
        twinRole: createPermissionTwinRoleApi(settings),
        assigneePropagation: createPermissionAssigneePropagationApi(settings),
        factory: createFactoryApi(settings),
        factoryPipeline: createFactoryPipelineApi(settings),
        factoryBranches: createFactoryBrancheApi(settings),
        pipelineSteps: createPipelineStepApi(settings),
        spaceRole: createPermissionSpaceRoleApi(settings),
        datalistOption: createDatalistOptionApi(settings),
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
