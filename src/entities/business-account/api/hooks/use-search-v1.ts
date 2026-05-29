import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { hydrateBusinessAccountFromMap } from "../../libs";
import {
  DomainBusinessAccountFilters,
  DomainBusinessAccount_DETAILED,
} from "../types";

export function useBusinessAccountSearch() {
  const api = useContext(PrivateApiContext);

  const searchBusinessAccount = useCallback(
    async ({
      pagination,
      filters = {},
      sort,
    }: {
      pagination: PaginationState;
      filters?: DomainBusinessAccountFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<DomainBusinessAccount_DETAILED>> => {
      try {
        const { data, error } = await api.businessAccount.search({
          pagination,
          filters,
          sortField: sort?.field as
            | "createdAt"
            | "businessAccountName"
            | "permissionSchemaName"
            | "twinClassSchemaName"
            | "twinflowSchemaName"
            | "notificationSchemaName"
            | "tierName"
            | "attachmentsStorageUsedCount"
            | "attachmentsStorageUsedSize"
            | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw new Error("Failed to fetch business accounts due to API error");
        }

        const businessAccount = data.businessAccounts?.map((dto) =>
          hydrateBusinessAccountFromMap(dto, data.relatedObjects)
        );

        return {
          data: businessAccount ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error("An error occured while fetching business accounts");
      }
    },
    [api]
  );

  return { searchBusinessAccount };
}
