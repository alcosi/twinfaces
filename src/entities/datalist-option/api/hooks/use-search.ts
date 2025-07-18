import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  DataListOptionFilters,
  DataListOptionV3,
  hydrateDatalistOptionFromMap,
} from "@/entities/datalist-option";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useDatalistOptionSearch = () => {
  const api = useContext(PrivateApiContext);

  const searchDatalistOptions = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: DataListOptionFilters;
    }): Promise<PagedResponse<DataListOptionV3>> => {
      try {
        const { data, error } = await api.datalistOption.search({
          pagination,
          filters,
        });
        if (error) {
          throw new Error("Failed to fetch datalist options due to API error");
        }

        const options =
          data?.options?.map((dto) =>
            hydrateDatalistOptionFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: options,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching datalist options");
      }
    },
    [api]
  );
  return { searchDatalistOptions };
};
