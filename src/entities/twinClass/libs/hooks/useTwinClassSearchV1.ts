import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { TwinClassFilters } from "../../api";
import { hydrateTwinClassFromMap } from "../helpers";
import { TwinClass_DETAILED } from "../types";

// TODO: Apply caching-strategy
export const useTwinClassSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchTwinClasses = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TwinClassFilters;
    }): Promise<PagedResponse<TwinClass_DETAILED>> => {
      try {
        const { data, error } = await api.twinClass.search({
          search,
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const twinClasses =
          data.twinClassList?.map((dto) =>
            hydrateTwinClassFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: twinClasses,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch twin classes:", error);
        throw new Error("An error occurred while fetching twin classes");
      }
    },
    [api]
  );

  return { searchTwinClasses };
};
