import { ApiContext, PagedResponse } from "@/shared/api";
import { Factory, FactoryFilters } from "@/entities/factory";
import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

export function useFactorySearch() {
  const api = useContext(ApiContext);

  const searchFactories = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: FactoryFilters;
    }): Promise<PagedResponse<Factory>> => {
      try {
        const { data, error } = await api.factory.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        return {
          data: data.factories ?? [],
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factories:", error);
        throw new Error("An error occurred while fetching factories: " + error);
      }
    },
    [api]
  );

  return { searchFactories };
}
