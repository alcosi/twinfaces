import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext, useState } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinClassFromMap } from "../../libs";
import { TwinClassFilters, TwinClass_DETAILED } from "../types";

// TODO: Apply caching-strategy
export const useTwinClassSearchV1 = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

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
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { searchTwinClasses, loading };
};
