import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinTriggerFromMap } from "../../libs";
import { TwinTriggerFilters, TwinTrigger_DETAILED } from "../types";

export function useTwinTriggerSearch() {
  const api = useContext(PrivateApiContext);

  const searchTwinTriggers = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: TwinTriggerFilters;
    }): Promise<PagedResponse<TwinTrigger_DETAILED>> => {
      try {
        const { data, error } = await api.twinTrigger.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const triggers =
          data.triggers?.map((dto) =>
            hydrateTwinTriggerFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: triggers,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch twin triggers:", error);
        throw new Error(
          "An error occured while fetching twin triggers: " + error
        );
      }
    },
    [api]
  );

  return { searchTwinTriggers };
}
