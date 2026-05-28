import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { hydrateBusinessAccountUserFromMap } from "../../libs";
import {
  DomainBusinessAccountUserFilters,
  DomainBusinessAccountUser_DETAILED,
} from "../types";

export function useBusinessAccountUserSearch() {
  const api = useContext(PrivateApiContext);

  const searchBusinessAccountUser = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: DomainBusinessAccountUserFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<DomainBusinessAccountUser_DETAILED>> => {
      try {
        const { data, error } =
          await api.businessAccount.searchDomainBusinessAccountUser({
            pagination,
            filters,
            sortField: sort?.field as
              | "createdAt"
              | "lastActivityAt"
              | "userName"
              | "businessAccountName"
              | undefined,
            sortDirection: sort?.direction,
          });

        if (error) {
          throw new Error(
            "Failed to fetch business account users due to API error"
          );
        }

        const businessAccountUser = data.domainBusinessAccountUsers?.map(
          (dto) => hydrateBusinessAccountUserFromMap(dto, data.relatedObjects)
        );

        return {
          data: businessAccountUser ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error(
          "An error occured while fetching business account users"
        );
      }
    },
    [api]
  );

  return { searchBusinessAccountUser };
}
