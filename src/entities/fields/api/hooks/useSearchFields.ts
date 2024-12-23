import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import {
  Fields_DETAILED,
  FieldsFilter,
  hydrateFieldsFromMap,
} from "@/entities/fields";

// TODO: Apply caching-strategy
export const useFieldsSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchFields = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: FieldsFilter;
    }): Promise<PagedResponse<Fields_DETAILED>> => {
      try {
        const { data, error } = await api.fields.search({
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch fields due to API error");
        }
        const fields =
          data.fields?.map((dto) =>
            hydrateFieldsFromMap(dto, data.relatedObjects)
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
