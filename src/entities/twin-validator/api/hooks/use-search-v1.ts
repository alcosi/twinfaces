import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { hydrateTwinValidatorFromMap } from "../../libs";
import {
  TwinValidatorFilters,
  TwinValidatorSortField,
  TwinValidator_DETAILED,
} from "../types";

export function useTwinValidatorSearch() {
  const api = useContext(PrivateApiContext);

  const searchTwinValidators = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: TwinValidatorFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<TwinValidator_DETAILED>> => {
      try {
        const { data, error } = await api.twinValidator.search({
          pagination,
          filters,
          sortField: sort?.field as TwinValidatorSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error("Twin validators response has no data");
        }

        const validators =
          data.validators?.map((dto) =>
            hydrateTwinValidatorFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: validators,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch twin validators:", error);
        throw new Error(
          "An error occured while fetching twin validators: " + error
        );
      }
    },
    [api]
  );

  return { searchTwinValidators };
}
