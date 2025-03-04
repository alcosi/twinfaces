"use client";

import { env } from "next-runtime-env";
import createClient from "openapi-fetch";
import React from "react";

import {
  PermissionAssigneePropagationApi,
  createPermissionAssigneePropagationApi,
} from "@/entities/assigneePropagation";
import { CommentApi, createCommentApi } from "@/entities/comment";
import { DatalistApi, createDatalistApi } from "@/entities/datalist";
import {
  DatalistOptionApi,
  createDatalistOptionApi,
} from "@/entities/datalist-option";
import { DomainApi, createDomainApi } from "@/entities/domain";
import { FactoryApi, createFactoryApi } from "@/entities/factory";
import {
  FactoryBranchApi,
  createFactoryBranchApi,
} from "@/entities/factory-branch";
import {
  FactoryConditionSetApi,
  createFactoryConditionSetApi,
} from "@/entities/factory-condition-set";
import {
  FactoryMultiplierApi,
  createFactoryMultiplierApi,
} from "@/entities/factory-multiplier";
import {
  FactoryPipelineApi,
  createFactoryPipelineApi,
} from "@/entities/factory-pipeline";
import {
  PipelineStepApi,
  createPipelineStepApi,
} from "@/entities/factory-pipeline-step";
import { FeaturerApi, createFeaturerApi } from "@/entities/featurer";
import { LinkApi, createLinkApi } from "@/entities/link";
import { PermissionApi, createPermissionApi } from "@/entities/permission";
import {
  PermissionGroupApi,
  createPermissionGroupApi,
} from "@/entities/permission-group";
import {
  PermissionSchemaApi,
  createPermissionSchemaApi,
} from "@/entities/permission-schema";
import {
  PermissionSpaceRoleApi,
  createPermissionSpaceRoleApi,
} from "@/entities/spaceRole";
import { TierApi, createTierApi } from "@/entities/tier";
import { TwinApi, createTwinApi } from "@/entities/twin";
import { TwinClassApi, createTwinClassApi } from "@/entities/twin-class";
import {
  TwinClassFieldApi,
  createTwinClassFieldApi,
} from "@/entities/twin-class-field";
import { TwinFlowApi, createTwinFlowApi } from "@/entities/twin-flow";
import {
  TwinFlowTransitionApi,
  createTwinFlowTransitionApi,
} from "@/entities/twin-flow-transition";
import {
  PermissionTwinRoleApi,
  createPermissionTwinRoleApi,
} from "@/entities/twin-role";
import { TwinStatusApi, createTwinStatusApi } from "@/entities/twin-status";
import {
  TwinFlowSchemaApi,
  createTwinFlowSchemaApi,
} from "@/entities/twinFlowSchema";
import { UserApi, createUserApi } from "@/entities/user";
import { UserGroupApi, createUserGroupApi } from "@/entities/user-group";
import { ApiSettings, PrivateApiContext } from "@/shared/api";
import { paths } from "@/shared/api/generated/schema";
import { LoadingOverlay } from "@/shared/ui";

import { useAuthUser } from "../../auth";

export interface PrivateApiContextProps {
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
  factoryMultiplier: FactoryMultiplierApi;
  pipelineStep: PipelineStepApi;
  spaceRole: PermissionSpaceRoleApi;
  datalistOption: DatalistOptionApi;
  link: LinkApi;
  tier: TierApi;
}

export function PrivateApiContextProvider({
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
    <PrivateApiContext.Provider
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
        factoryMultiplier: createFactoryMultiplierApi(settings),
        pipelineStep: createPipelineStepApi(settings),
        spaceRole: createPermissionSpaceRoleApi(settings),
        datalistOption: createDatalistOptionApi(settings),
        link: createLinkApi(settings),
        tier: createTierApi(settings),
      }}
    >
      {children}
    </PrivateApiContext.Provider>
  );
}
