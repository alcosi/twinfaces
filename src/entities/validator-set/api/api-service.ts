import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  ValidatorSetCountGroupField,
  ValidatorSetCreateRq,
  ValidatorSetFilters,
  ValidatorSetSortField,
  ValidatorSetUpdateRq,
} from "./types";

export function createValidatorSetApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: ValidatorSetFilters;
    sortField?: ValidatorSetSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/twin_validator_set/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinValidatorSetMode: "DETAILED",
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
    filters: ValidatorSetFilters;
    groupFields: ValidatorSetCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/twin_validator_set/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinValidatorSetMode: "DETAILED",
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

  function create({ body }: { body: ValidatorSetCreateRq }) {
    return settings.client.POST("/private/twin_validator_set/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function update({ body }: { body: ValidatorSetUpdateRq }) {
    return settings.client.PUT("/private/twin_validator_set/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return { search, count, create, update };
}

export type ValidatorSetApi = ReturnType<typeof createValidatorSetApi>;
