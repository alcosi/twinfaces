import { ApiContext } from "@/shared/api";
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
    }): Promise<{ data: TwinClass_DETAILED[]; pageCount: number }> => {
      try {
        const { data, error } = await api.twinClass.search({
          search,
          pagination,
          filters,
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
