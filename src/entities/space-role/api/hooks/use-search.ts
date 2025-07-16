import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateSpaceRoleFromMap } from "../../libs";
import { SpaceRole, SpaceRoleFilters } from "../types";

export const useSpaceRoleSearch = () => {
  const api = useContext(PrivateApiContext);

  const searchSpaceRole = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: SpaceRoleFilters;
    } = {}): Promise<PagedResponse<SpaceRole>> => {
      try {
        const { data, error } = await api.spaceRole.search({
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch space role due to API error");
        }

        const SpaceRoles =
          data.spaceRoles?.map((dto) =>
            hydrateSpaceRoleFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: SpaceRoles,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occured while fetching space role");
      }
    },
    [api]
  );

  return { searchSpaceRole };
};
