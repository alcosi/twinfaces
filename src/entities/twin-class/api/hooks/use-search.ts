import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext, useState } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinClassFromMap } from "../../libs";
import {
  TwinClassFilters,
  TwinClassListRs,
  TwinClass_DETAILED,
} from "../types";

export const useTwinClassSearch = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState(false);

  const searchBySearchId = useCallback(
    async (args: {
      searchId: string;
      narrow: TwinClassFilters;
      params?: Record<string, string>;
    }): Promise<PagedResponse<TwinClass_DETAILED>> => {
      setLoading(true);

      try {
        const { data, error } = await api.twinClass.searchBySearchId(args);

        if (error) throw error;

        return {
          data: mapAndHydrate(data),
          pagination: data.pagination ?? {},
        };
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const searchByFilters = useCallback(
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

        if (error) throw error;

        return {
          data: mapAndHydrate(data),
          pagination: data.pagination ?? {},
        };
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { searchBySearchId, searchByFilters, loading };
};

function mapAndHydrate(res: TwinClassListRs) {
  return (res.twinClassList ?? []).map((dto) =>
    hydrateTwinClassFromMap(dto, res.relatedObjects)
  );
}
