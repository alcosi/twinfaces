import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TransitionAliasFilters,
  TransitionTriggersFilters,
  TwinFlowTransitionCreateRq,
  TwinFlowTransitionFilters,
  TwinFlowTransitionUpdateRq,
  TwinTransitionPerformRq,
  TwinTransitionTriggerCreate,
  TwinTransitionTriggerUpdate,
} from "./types";

export function createTwinFlowTransitionApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    search?: string;
    pagination: PaginationState;
    filters: TwinFlowTransitionFilters;
  }) {
    return settings.client.POST("/private/transition/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTransitionMode: "DETAILED",
          showTransition2PermissionMode: "DETAILED",
          showTransition2StatusMode: "DETAILED",
          showTransition2UserMode: "SHORT",
          showTransition2TwinflowMode: "DETAILED",
          showTwinflow2TwinClassMode: "DETAILED",
          showTransition2FactoryMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  function fetchById(transitionId: string) {
    return settings.client.GET("/private/transition/{transitionId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { transitionId },
        query: {
          lazyRelation: false,
          showTransitionMode: "DETAILED",
          showTransition2StatusMode: "DETAILED",
          showTransition2PermissionMode: "DETAILED",
          showTwinflowTransition2TwinflowTransitionValidatorRuleMode:
            "DETAILED",
          showTwinflowTransitionValidatorRule2TwinValidatorSetMode: "DETAILED",
          showTransition2TwinflowMode: "DETAILED",
          showTwinflow2TwinClassMode: "DETAILED",
          showTransition2FactoryMode: "DETAILED",
        },
      },
    });
  }

  function create({
    twinFlowId,
    body,
  }: {
    twinFlowId: string;
    body: TwinFlowTransitionCreateRq;
  }) {
    return settings.client.POST(
      "/private/twinflow/{twinflowId}/transition/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinflowId: twinFlowId },
        },
        body,
      }
    );
  }

  function update({
    transitionId,
    body,
  }: {
    transitionId: string;
    body: TwinFlowTransitionUpdateRq;
  }) {
    return settings.client.POST("/private/transition/{transitionId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { transitionId },
      },
      body,
    });
  }

  function performTransition({
    id,
    body,
  }: {
    id: string;
    body: TwinTransitionPerformRq;
  }) {
    return settings.client.POST(
      `/private/transition/{transitionId}/perform/v2`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { transitionId: id },
        },
        body,
      }
    );
  }

  function searchAlias({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TransitionAliasFilters;
  }) {
    return settings.client.POST("/private/transition_alias/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          showTransitionAliasMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: { ...filters },
    });
  }

  function searchTriggers({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TransitionTriggersFilters;
  }) {
    return settings.client.POST("/private/transition_trigger/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTransitionTriggerMode: "DETAILED",
          showTransitionTrigger2TransitionMode: "DETAILED",
          showTransitionTrigger2FeaturerMode: "DETAILED",
          showFeaturerParamMode: "SHOW",
          showTwinClassMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        search: filters,
      },
    });
  }

  function createTrigger({ body }: { body: TwinTransitionTriggerCreate }) {
    return settings.client.POST("/private/transition_trigger/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function updateTrigger({
    body,
  }: {
    triggerId: string;
    body: TwinTransitionTriggerUpdate;
  }) {
    return settings.client.PUT("/private/transition_trigger/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return {
    search,
    fetchById,
    create,
    update,
    performTransition,
    searchAlias,
    searchTriggers,
    createTrigger,
    updateTrigger,
  };
}

export type TwinFlowTransitionApi = ReturnType<
  typeof createTwinFlowTransitionApi
>;
