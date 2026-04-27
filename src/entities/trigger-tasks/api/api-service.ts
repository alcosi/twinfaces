import { PaginationState } from "@tanstack/react-table";

import { TriggerTaskFilters } from "@/entities/trigger-tasks";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createTriggerTaskApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TriggerTaskFilters;
  }) {
    return settings.client.POST("/private/twin_trigger_task/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinTriggerTaskMode: "DETAILED",
          showTwinTriggerTask2BusinessAccountMode: "DETAILED",
          showTwinTriggerTask2TwinTriggerMode: "DETAILED",
          showTwinTriggerTask2StatusMode: "DETAILED",
          showTwinTriggerTask2TwinMode: "DETAILED",
          showTwinTriggerTask2UserMode: "DETAILED",
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

  return { search };
}

export type TriggerTaskApi = ReturnType<typeof createTriggerTaskApi>;
