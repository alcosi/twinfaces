import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext, useState } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinClassFromMap } from "../../libs";
import { TwinClassFilters, TwinClass_DETAILED } from "../types";

type SearchBySearchIdArgs = {
  searchId: string;
  narrow: TwinClassFilters;
  params?: Record<string, string>;
};

type SearchByFiltersArgs = {
  search?: string;
  pagination?: PaginationState;
  filters?: TwinClassFilters;
};

type SearchTwinClassesArgs = SearchBySearchIdArgs | SearchByFiltersArgs;

export const useTwinClassSearch = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState(false);

  const searchTwinClasses = useCallback(
    async (
      args: SearchTwinClassesArgs
    ): Promise<PagedResponse<TwinClass_DETAILED>> => {
      setLoading(true);

      try {
        if ("searchId" in args) {
          const { searchId, narrow, params = {} } = args;

          const { data, error } = await api.twinClass.searchBySearchId({
            searchId,
            narrow,
            params,
          });

          if (error) throw error;

          const twinClasses =
            data.twinClassList?.map((dto) =>
              hydrateTwinClassFromMap(dto, data.relatedObjects)
            ) ?? [];

          return {
            data: twinClasses,
            pagination: data.pagination ?? {},
          };
        }

        const {
          search,
          pagination = { pageIndex: 0, pageSize: 10 },
          filters = {},
        } = args;

        const { data, error } = await api.twinClass.search({
          search,
          pagination,
          filters,
        });

        if (error) throw error;

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
