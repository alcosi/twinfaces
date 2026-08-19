import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import {
  ValidatorSetFilters,
  ValidatorSetSortField,
  ValidatorSet_DETAILED,
} from "../types";

export function useValidatorSetSearch() {
  const api = useContext(PrivateApiContext);

  const searchValidatorSets = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
      sort,
    }: {
      pagination?: PaginationState;
      filters?: ValidatorSetFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<ValidatorSet_DETAILED>> => {
      try {
        const { data, error } = await api.validatorSet.search({
          pagination,
          filters,
          sortField: sort?.field as ValidatorSetSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw new Error("Failed to fetch validator sets due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const validatorSets =
          (data.validatorSets as ValidatorSet_DETAILED[]) ?? [];

        return { data: validatorSets, pagination: data.pagination ?? {} };
      } catch {
        throw new Error("An error occurred while fetching validator sets");
      }
    },
    [api]
  );

  return { searchValidatorSets };
}
