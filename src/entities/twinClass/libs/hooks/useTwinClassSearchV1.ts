import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { ApiContext } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { buildFilters, hydrateTwinClassFromMap } from "../helpers";
import { TwinClass_DETAILED } from "../types";

// TODO: Apply caching-strategy
// TODO: Apply `searchTerm` debouncing - https://alcosi.atlassian.net/browse/TWINFACES-77
export const useTwinClassSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchTwinClasses = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = { filters: {} },
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: FiltersState;
    }): Promise<{ data: TwinClass_DETAILED[]; pageCount: number }> => {
      try {
        const { data, error } = await api.twinClass.search({
          search,
          pagination,
          filters: buildFilters(filters),
        });

        if (error) {
          console.error("Failed to fetch classes due to API error:", error);
          throw new Error("Failed to fetch classes due to API error");
        }

        const twinClasses =
          data.twinClassList?.map((dto) =>
            hydrateTwinClassFromMap(dto, data.relatedObjects)
          ) ?? [];

        const totalItems = data.pagination?.total ?? 0;
        const pageCount = Math.ceil(totalItems / pagination.pageSize);

        console.log("Fetched twin classes:", twinClasses);
        return { data: twinClasses, pageCount };
      } catch (error) {
        console.error("Failed to fetch twin classes:", error);
        throw new Error("An error occurred while fetching twin classes");
      }
    },
    [api]
  );

  return { searchTwinClasses };
};
