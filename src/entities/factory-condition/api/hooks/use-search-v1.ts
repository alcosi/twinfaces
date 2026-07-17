import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { hydrateFactoryConditionFromMap } from "../../libs";
import {
  FactoryConditionFilters,
  FactoryConditionSortField,
  FactoryCondition_DETAILED,
} from "../types";

export function useFactoryConditionSearch() {
  const api = useContext(PrivateApiContext);

  const searchFactoryCondition = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: FactoryConditionFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<FactoryCondition_DETAILED>> => {
      try {
        const { data, error } = await api.factoryCondition.search({
          pagination,
          filters,
          sortField: sort?.field as FactoryConditionSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Factory conditions response has no data");
        }

        const factoryConditions =
          data.conditions?.map((dto) =>
            hydrateFactoryConditionFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: factoryConditions,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch factory conditions:", error);
        throw new Error(
          "An error occured while fetching factory conditions: " + error
        );
      }
    },
    [api]
  );

  return { searchFactoryCondition };
}
