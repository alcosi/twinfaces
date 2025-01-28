import { ApiContext, PagedResponse } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { hydrateTwinClassFieldFromMap } from "../../libs";
import {
  TwinClassFieldSearchFilters,
  TwinClassFieldV2_DETAILED,
} from "../types";

// TODO: Apply caching-strategy
export const useTwinClassFieldSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchTwinClassFields = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TwinClassFieldSearchFilters;
    }): Promise<PagedResponse<TwinClassFieldV2_DETAILED>> => {
      try {
        const { data, error } = await api.twinClassField.search({
          pagination,
          filters: {
            ...filters,
            keyLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.keyLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch twin class fields due to API error");
        }

        const twinClassFields =
          data.fields?.map((dto) =>
            hydrateTwinClassFieldFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinClassFields, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching twin class fields");
      }
    },
    [api]
  );

  return { searchTwinClassFields };
};
