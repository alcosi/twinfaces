import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TwinTriggerCreateRq,
  TwinTriggerFilters,
  TwinTriggerUpdateRq,
} from "./types";

export function createTwinTriggerApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TwinTriggerFilters;
  }) {
    return settings.client.POST("/private/twin_trigger/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinTriggerMode: "DETAILED",
          showTwinTrigger2FeaturerMode: "DETAILED",
          showFeaturerParamMode: "SHOW",
          showTwinTrigger2TwinClassMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
      },
    });
  }

  function create({ body }: { body: TwinTriggerCreateRq }) {
    return settings.client.POST(`/private/twin_trigger/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({ body }: { body: TwinTriggerUpdateRq }) {
    return settings.client.PUT("/private/twin_trigger/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return { search, create, update };
}

export type TwinTriggerApi = ReturnType<typeof createTwinTriggerApi>;
