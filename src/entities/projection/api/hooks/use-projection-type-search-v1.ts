import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { ProjectionType, ProjectionTypeFilters } from "../types";

export function useProjectionTypesSearch() {
  const api = useContext(PrivateApiContext);

  const searchProjectionTypes = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: ProjectionTypeFilters;
    }): Promise<PagedResponse<ProjectionType>> => {
      try {
        const { data, error } = await api.projection.searchProjectionType({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        return {
          data: data.projectionTypes ?? [],
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch projection types:", error);
        throw new Error(
          "An error occured while fetching projection types: " + error
        );
      }
    },
    [api]
  );

  return { searchProjectionTypes };
}
