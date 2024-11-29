import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { TwinFlowCreateRq, TwinFlowUpdateRq } from "./types";

export function createTwinFlowApi(settings: ApiSettings) {
  function search({
    twinClassId,
    pagination,
    nameFilter,
    descriptionFilter,
    initialStatusFilter,
  }: {
    twinClassId: string;
    pagination: PaginationState;
    nameFilter?: string;
    descriptionFilter?: string;
    initialStatusFilter?: string;
  }) {
    return settings.client.POST("/private/twinflow/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          showTwinflowMode: "DETAILED",
          showTwinflow2TransitionMode: "DETAILED",
          showTransition2StatusMode: "SHORT",
          showTwinflowInitStatus2StatusMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        twinClassIdList: [twinClassId],
        nameI18nLikeList: nameFilter ? ["%" + nameFilter + "%"] : undefined,
        descriptionI18nLikeList: descriptionFilter
          ? ["%" + descriptionFilter + "%"]
          : undefined,
        initialStatusIdList: initialStatusFilter
          ? [initialStatusFilter]
          : undefined,
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
          showTwinflowInitStatus2StatusMode: "SHORT",
          showTransition2PermissionMode: "DETAILED",
          showTransition2UserMode: "SHORT",
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
