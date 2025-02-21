import { ApiContext, PagedResponse } from "@/shared/api";
import { useCallback, useContext } from "react";
import { PaginationState } from "@tanstack/table-core";
import {
  DataListOptionV3,
  hydrateDatalistOptionFromMap,
} from "@/entities/datalist-option";
import { TagListOptionFilter, TagSearchResponse } from "../types";

export const useTagSearch = () => {
  const api = useContext(ApiContext);

  const searchTagListOptions = useCallback(
    async ({
      twinClassId = "",
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      twinClassId: string;
      pagination?: PaginationState;
      filters?: TagListOptionFilter;
    }): Promise<PagedResponse<DataListOptionV3>> => {
      try {
        const { data, error } = await api.twinClass.searchTags({
          twinClassId,
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
  return { searchTagListOptions };
};
