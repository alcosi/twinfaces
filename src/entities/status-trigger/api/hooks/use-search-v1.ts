import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateStatusTriggerFromMap } from "../../libs";
import { StatusTriggerFilters, StatusTrigger_DETAILED } from "../types";

export function useStatusTriggerSearch() {
  const api = useContext(PrivateApiContext);

  const searchStatusTriggers = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: StatusTriggerFilters;
    }): Promise<PagedResponse<StatusTrigger_DETAILED>> => {
      try {
        const { data, error } = await api.statusTrigger.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const statusTriggers =
          data.twinStatusTriggers?.map((dto) =>
            hydrateStatusTriggerFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: statusTriggers,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch twin status triggers:", error);
        throw new Error(
          "An error occured while fetching twin status triggers: " + error
        );
      }
    },
    [api]
  );

  return { searchStatusTriggers };
}
