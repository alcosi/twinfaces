import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateProjectionFromMap } from "../../libs";
import { ProjectionFilters, Projection_DETAILED } from "../types";

export function useProjectionsSearch() {
  const api = useContext(PrivateApiContext);

  const searchProjections = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: ProjectionFilters;
    }): Promise<PagedResponse<Projection_DETAILED>> => {
      try {
        const { data, error } = await api.projection.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const projections =
          data.projections?.map((dto) =>
            hydrateProjectionFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: projections,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch projections:", error);
        throw new Error(
          "An error occured while fetching projections: " + error
        );
      }
    },
    [api]
  );

  return { searchProjections };
}
