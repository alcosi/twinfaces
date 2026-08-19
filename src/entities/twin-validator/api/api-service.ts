import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TwinValidatorCountGroupField,
  TwinValidatorFilters,
  TwinValidatorSortField,
} from "./types";

export function createTwinValidatorApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: TwinValidatorFilters;
    sortField?: TwinValidatorSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/twin_validator/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinValidatorMode: "DETAILED",
          showTwinValidator2TwinValidatorSetMode: "DETAILED",
          showTwinValidator2FeaturerMode: "DETAILED",
          showFeaturerParamMode: "SHOW",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        search: { ...filters },
        sortField,
        sortDirection,
      },
    });
  }

  function count({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: TwinValidatorFilters;
    groupFields: TwinValidatorCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/twin_validator/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinValidatorMode: "DETAILED",
          showTwinValidator2TwinValidatorSetMode: "DETAILED",
          showTwinValidator2FeaturerMode: "DETAILED",
          offset,
          limit,
          sortAsc,
        },
      },
      body: {
        search: { ...filters },
        groupFields,
      },
    });
  }

  return { search, count };
}

export type TwinValidatorApi = ReturnType<typeof createTwinValidatorApi>;
