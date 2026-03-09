import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { ValidatorSetCreateRq, ValidatorSetFilters } from "./types";

export function createValidatorSetApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: ValidatorSetFilters;
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
        ...filters,
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

  return { search, create };
}

export type ValidatorSetApi = ReturnType<typeof createValidatorSetApi>;
