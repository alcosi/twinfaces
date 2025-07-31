import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext, useState } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { hydrateTwinClassFieldFromMap } from "../../libs";
import {
  TwinClassFieldSearchFilters,
  TwinClassFieldV2_DETAILED,
} from "../types";

type SearchBySearchIdArgs = {
  searchId: string;
  narrow: TwinClassFieldSearchFilters;
  params?: Record<string, string>;
};

type SearchByFiltersArgs = {
  search?: string;
  pagination?: PaginationState;
  filters?: TwinClassFieldSearchFilters;
};

type SearchTwinClassFieldsArgs = SearchBySearchIdArgs | SearchByFiltersArgs;

export const useTwinClassFieldSearch = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const searchTwinClassFields = useCallback(
    async (
      args: SearchTwinClassFieldsArgs
    ): Promise<{
      data: TwinClassFieldV2_DETAILED[];
      pagination?: PagedResponse<TwinClassFieldV2_DETAILED>["pagination"];
    }> => {
      setLoading(true);

      try {
        if ("searchId" in args) {
          const { searchId, narrow, params = {} } = args;

          const { data, error } = await api.twinClassField.searchBySearchId({
            searchId,
            narrow,
            params,
          });

          if (error) throw error;

          const twinClassFields =
            data.fields?.map((dto) =>
              hydrateTwinClassFieldFromMap(dto, data.relatedObjects)
            ) ?? [];

          return { data: twinClassFields };
        }

        const {
          search,
          pagination = { pageIndex: 0, pageSize: 10 },
          filters,
        } = args;

        const { data, error } = await api.twinClassField.search({
          pagination,
          filters: {
            ...filters,
            keyLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.keyLikeList,
          },
        });

        if (error) throw error;

        const twinClassFields =
          data.fields?.map((dto) =>
            hydrateTwinClassFieldFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinClassFields, pagination: data.pagination ?? {} };
      } catch (error) {
        console.error("Failed to fetch twin class fields:", error);
        throw new Error("An error occurred while fetching twin class fields");
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { searchTwinClassFields, loading };
};
