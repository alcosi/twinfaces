import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { DataList, DatalistFilters } from "../types";

// TODO: Apply caching-strategy
export const useDatalistSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchDatalist = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: DatalistFilters;
    }): Promise<PagedResponse<DataList>> => {
      try {
        const { data, error } = await api.datalist.search({
          pagination,
          filters: {
            ...filters,
            nameLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.nameLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch datalist due to API error");
        }

        return {
          data: data?.dataListList ?? [],
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching datalist");
      }
    },
    [api]
  );

  return { searchDatalist };
};
