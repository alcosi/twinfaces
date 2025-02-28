import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { ApiContext, PagedResponse } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { hydrateUserGroupFromMap } from "../../libs";
import { UserGroupFilters, UserGroup_DETAILED } from "../types";

// TODO: Apply caching-strategy
export const useUserGroupSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchUserGroups = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: UserGroupFilters;
    }): Promise<PagedResponse<UserGroup_DETAILED>> => {
      try {
        const { data, error } = await api.userGroup.search({
          pagination,
          filters: {
            ...filters,
            nameI18NLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.nameI18NLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch twins due to API error");
        }

        const twinList =
          data.userGroupList?.map((dto) =>
            hydrateUserGroupFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinList, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching user groups");
      }
    },
    [api]
  );

  return { searchUserGroups };
};
