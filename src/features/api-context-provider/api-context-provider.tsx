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
  createFactoryBranchApi,
  FactoryBranchApi,
} from "@/entities/factory-branch";
import {
  createFactoryConditionSetApi,
  FactoryConditionSetApi,
} from "@/entities/factory-condition-set";
import {
  createFactoryPipelineApi,
  FactoryPipelineApi,
} from "@/entities/factory-pipeline";
import { createFeaturerApi, FeaturerApi } from "@/entities/featurer";
import { createLinkApi, LinkApi } from "@/entities/link";
import { createPermissionApi, PermissionApi } from "@/entities/permission";
import {
  createPermissionSchemaApi,
  PermissionSchemaApi,
} from "@/entities/permission-schema";
import {
  createPermissionGroupApi,
  PermissionGroupApi,
} from "@/entities/permissionGroup";
import {
  createPipelineStepApi,
  PipelineStepApi,
} from "@/entities/pipeline-step";
import {
  createPermissionSpaceRoleApi,
  PermissionSpaceRoleApi,
} from "@/entities/spaceRole";
import { createTwinApi, TwinApi } from "@/entities/twin";
import { createTwinClassApi, TwinClassApi } from "@/entities/twin-class";
import {
  createTwinClassFieldApi,
  TwinClassFieldApi,
} from "@/entities/twin-class-field";
import { createTwinStatusApi, TwinStatusApi } from "@/entities/twin-status";
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
import { createUserApi, UserApi } from "@/entities/user";
import { createUserGroupApi, UserGroupApi } from "@/entities/userGroup";
import { ApiContext, ApiSettings } from "@/shared/api";
import { paths } from "@/shared/api/generated/schema";
import { LoadingOverlay } from "@/shared/ui";
import { env } from "next-runtime-env";
import createClient from "openapi-fetch";
import React from "react";
import { useAuthUser } from "../auth";

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
  factoryBranch: FactoryBranchApi;
  factoryConditionSet: FactoryConditionSetApi;
  pipelineStep: PipelineStepApi;
  spaceRole: PermissionSpaceRoleApi;
  datalistOption: DatalistOptionApi;
  link: LinkApi;
}

export function ApiContextProvider({
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

  if (!authUser?.authToken) return <LoadingOverlay />;

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
        factoryBranch: createFactoryBranchApi(settings),
        factoryConditionSet: createFactoryConditionSetApi(settings),
        pipelineStep: createPipelineStepApi(settings),
        spaceRole: createPermissionSpaceRoleApi(settings),
        datalistOption: createDatalistOptionApi(settings),
        link: createLinkApi(settings),
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
