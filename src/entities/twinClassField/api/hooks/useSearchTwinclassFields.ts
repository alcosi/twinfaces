import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import {
  hydrateTwinclassFieldFromMap,
  TwinClassFieldV2_DETAILED,
  TwinClassFieldV2Filters,
} from "@/entities/twinClassField";

// TODO: Apply caching-strategy
export const useSearchTwinclassFields = () => {
  const api = useContext(ApiContext);

  const searchFields = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: TwinClassFieldV2Filters;
    }): Promise<PagedResponse<TwinClassFieldV2_DETAILED>> => {
      try {
        const { data, error } = await api.twinClassField.search({
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch fields due to API error");
        }
        const fields =
          data.fields?.map((dto) =>
            hydrateTwinclassFieldFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: fields,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching fields roles");
      }
    },
    [api]
  );

  return { searchFields };
};
