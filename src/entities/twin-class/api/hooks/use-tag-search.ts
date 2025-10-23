import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  DataListOptionV1,
  hydrateDatalistOptionFromMap,
} from "@/entities/datalist-option";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { TagSearchFilters } from "../types";

export const useTagSearch = (twinClassId?: string) => {
  const api = useContext(PrivateApiContext);

  const searchTags = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: TagSearchFilters;
    }): Promise<PagedResponse<DataListOptionV1>> => {
      if (isUndefined(twinClassId)) {
        return { data: [], pagination: {} };
      }

      try {
        const { data, error } = await api.twinClass.searchTags({
          twinClassId,
          pagination,
          filters,
        });
        if (error) {
          throw new Error("Failed to fetch tags due to API error");
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
        throw new Error("An error occurred while fetching tags");
      }
    },
    [api]
  );

  return { searchTags };
};
