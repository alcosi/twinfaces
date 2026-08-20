import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { DataList, DataListSortField, DatalistFilters } from "../types";

export const useDatalistSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchDatalist = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
      sort,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: DatalistFilters;
      sort?: SortV1;
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
          sortField: sort?.field as DataListSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw new Error("Failed to fetch datalist due to API error");
        }

        if (!data) {
          throw new Error("Datalist response has no data");
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
