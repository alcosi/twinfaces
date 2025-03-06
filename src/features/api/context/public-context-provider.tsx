"use client";

import { env } from "next-runtime-env";
import createClient from "openapi-fetch";
import React from "react";

import { UserApi, createUserApi } from "@/entities/user";
import { ApiSettings, PublicApiContext } from "@/shared/api";
import { paths } from "@/shared/api/generated/schema";

import { useAuthUser } from "../../auth";

export interface PublicApiContextProps {
  // domain: DomainApi;
  // twinFlowSchema: TwinFlowSchemaApi;
  // twinClassField: TwinClassFieldApi;
  // twinClass: TwinClassApi;
  // twinStatus: TwinStatusApi;
  // twinFlow: TwinFlowApi;
  // twinFlowTransition: TwinFlowTransitionApi;
  // featurer: FeaturerApi;
  // twin: TwinApi;
  // permission: PermissionApi;
  // permissionGroup: PermissionGroupApi;
  // permissionSchema: PermissionSchemaApi;
  user: UserApi;
  // userGroup: UserGroupApi;
  // datalist: DatalistApi;
  // comment: CommentApi;
  // twinRole: PermissionTwinRoleApi;
  // assigneePropagation: PermissionAssigneePropagationApi;
  // factory: FactoryApi;
  // factoryPipeline: FactoryPipelineApi;
  // factoryBranch: FactoryBranchApi;
  // factoryConditionSet: FactoryConditionSetApi;
  // factoryMultiplier: FactoryMultiplierApi;
  // pipelineStep: PipelineStepApi;
  // spaceRole: PermissionSpaceRoleApi;
  // datalistOption: DatalistOptionApi;
  // link: LinkApi;
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
        // domain: createDomainApi(settings),
        // twinFlowSchema: createTwinFlowSchemaApi(settings),
        // twinClassField: createTwinClassFieldApi(settings),
        // twinClass: createTwinClassApi(settings),
        // twinStatus: createTwinStatusApi(settings),
        // twinFlow: createTwinFlowApi(settings),
        // twinFlowTransition: createTwinFlowTransitionApi(settings),
        // featurer: createFeaturerApi(settings),
        // twin: createTwinApi(settings),
        // permission: createPermissionApi(settings),
        // permissionGroup: createPermissionGroupApi(settings),
        // permissionSchema: createPermissionSchemaApi(settings),
        user: createUserApi(settings),
        // userGroup: createUserGroupApi(settings),
        // datalist: createDatalistApi(settings),
        // comment: createCommentApi(settings),
        // twinRole: createPermissionTwinRoleApi(settings),
        // assigneePropagation: createPermissionAssigneePropagationApi(settings),
        // factory: createFactoryApi(settings),
        // factoryPipeline: createFactoryPipelineApi(settings),
        // factoryBranch: createFactoryBranchApi(settings),
        // factoryConditionSet: createFactoryConditionSetApi(settings),
        // factoryMultiplier: createFactoryMultiplierApi(settings),
        // pipelineStep: createPipelineStepApi(settings),
        // spaceRole: createPermissionSpaceRoleApi(settings),
        // datalistOption: createDatalistOptionApi(settings),
        // link: createLinkApi(settings),
      }}
    >
      {children}
    </PublicApiContext.Provider>
  );
}
