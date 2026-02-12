import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinClassDynamicMarkerFromMap } from "../../libs";
import {
  TwinClassDynamicMarkerFilters,
  TwinClassDynamicMarker_DETAILED,
} from "../types";

export function useTwinClassDynamicMarkerSearch() {
  const api = useContext(PrivateApiContext);

  const searchTwinClassDynamicMarker = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: TwinClassDynamicMarkerFilters;
    }): Promise<PagedResponse<TwinClassDynamicMarker_DETAILED>> => {
      try {
        const { data, error } = await api.twinClass.searchDynamicMarkers({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const twinClassDynamicMarkers =
          data.dynamicMarkers?.map((dto) =>
            hydrateTwinClassDynamicMarkerFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: twinClassDynamicMarkers,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch twin class dynamic markers:", error);
        throw new Error(
          "An error occured while fetching twin class dynamic markers: " + error
        );
      }
    },
    [api]
  );

  return { searchTwinClassDynamicMarker };
}
