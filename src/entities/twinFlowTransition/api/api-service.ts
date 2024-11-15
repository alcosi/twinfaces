import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import {
  TwinFlowTransitionApiFilters,
  TwinFlowTransitionCreateRq,
  TwinFlowTransitionUpdateRq,
} from "./types";
import { PaginationState } from "@tanstack/react-table";

export function createTwinFlowTransitionApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinFlowTransitionApiFilters;
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
          showTransitionMode: "MANAGED",
          showTransition2StatusMode: "DETAILED",
          showTransition2PermissionMode: "DETAILED",
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

  return {
    search,
    fetchById,
    create,
    update,
  };
}

export type TwinFlowTransitionApi = ReturnType<
  typeof createTwinFlowTransitionApi
>;
