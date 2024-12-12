import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { DomainUser, DomainUser_DETAILED, DomainUserFilters } from "../types";
import { hydrateDomainUserFromMap } from "../../libs";

// TODO: Apply caching-strategy
export const useDomainUserSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchUsers = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: DomainUserFilters;
    }): Promise<PagedResponse<DomainUser_DETAILED>> => {
      try {
        const { data, error } = await api.user.searchDomainUsers({
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch users due to API error");
        }

        const users =
          data.users?.map((dto) =>
            hydrateDomainUserFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: users, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching users");
      }
    },
    [api]
  );

  return { searchUsers };
};
