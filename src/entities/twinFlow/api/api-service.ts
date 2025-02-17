import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { TwinFlowCreateRq, TwinFlowFilters, TwinFlowUpdateRq } from "./types";

export function createTwinFlowApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinFlowFilters;
  }) {
    return settings.client.POST("/private/twinflow/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinflowMode: "DETAILED",
          showTwinflow2TransitionMode: "DETAILED",
          showTransition2StatusMode: "SHORT",
          showTwinflowInitStatus2StatusMode: "DETAILED",
          showTwinflow2UserMode: "DETAILED",
          showTwinflow2TwinClassMode: "DETAILED",
          showTransition2UserMode: "SHORT",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  function getById({ twinFlowId }: { twinFlowId: string }) {
    return settings.client.GET("/private/twinflow/{twinflowId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinflowId: twinFlowId },
        query: {
          // lazyRelation: false,
          showTwinflowMode: "DETAILED",
          showTwinflow2TransitionMode: "DETAILED",
          showTransition2StatusMode: "SHORT",
          showTwinflowInitStatus2StatusMode: "DETAILED",
          showTransition2PermissionMode: "DETAILED",
          showTransition2UserMode: "SHORT",
          showTwinflow2TwinClassMode: "DETAILED",
        },
      },
    });
  }

  function create({
    twinClassId,
    body,
  }: {
    twinClassId: string;
    body: TwinFlowCreateRq;
  }) {
    return settings.client.POST(
      "/private/twin_class/{twinClassId}/twinflow/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinClassId },
        },
        body: body,
      }
    );
  }

  function update({ id, body }: { id: string; body: TwinFlowUpdateRq }) {
    return settings.client.PUT("/private/twinflow/{twinflowId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinflowId: id },
      },
      body,
    });
  }

  return {
    search,
    getById,
    create,
    update,
  };
}

export type TwinFlowApi = ReturnType<typeof createTwinFlowApi>;
