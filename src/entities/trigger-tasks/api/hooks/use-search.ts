import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import {
  TriggerTaskFilters,
  TriggerTask_DETAILED,
  hydrateTriggerTaskFromMap,
} from "@/entities/trigger-tasks";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export function useTriggerTaskSearch() {
  const api = useContext(PrivateApiContext);

  const searchTriggerTasks = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: TriggerTaskFilters;
    }): Promise<PagedResponse<TriggerTask_DETAILED>> => {
      try {
        const { data, error } = await api.triggerTask.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }
        const tasks =
          data.twinTriggerTasks?.map((dto) =>
            hydrateTriggerTaskFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: tasks,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch trigger tasks:", error);
        throw new Error(
          "An error occured while fetching trigger tasks: " + error
        );
      }
    },
    [api]
  );

  return { searchTriggerTasks };
}
