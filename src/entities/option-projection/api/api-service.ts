import { PaginationState } from "@tanstack/react-table";

import {
  OptionProjectionCreateRq,
  OptionProjectionFilters,
} from "@/entities/option-projection";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createOptionProjectionApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: OptionProjectionFilters;
  }) {
    return settings.client.POST(
      `/private/data_list_option_projection/search/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showDataListOptionProjectionMode: "DETAILED",
            showDataListOptionProjection2ProjectionTypeMode: "DETAILED",
            showDataListOptionProjection2UserMode: "DETAILED",
            showDataListOptionProjection2DataListOptionMode: "DETAILED",
            showDataListOption2DataListMode: "DETAILED",
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
          },
        },
        body: {
          search: {
            ...filters,
          },
        },
      }
    );
  }

  function create({ body }: { body: OptionProjectionCreateRq }) {
    return settings.client.POST(`/private/data_list_option_projection/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  return {
    create,
    search,
  };
}

export type OptionProjectionApi = ReturnType<typeof createOptionProjectionApi>;
