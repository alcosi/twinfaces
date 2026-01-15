import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { hydrateTierFromMap } from "@/entities/tier";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { TierFilters, Tier_DETAILED } from "../types";

export const useTierSearch = () => {
  const api = useContext(PrivateApiContext);

  const searchTiers = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TierFilters;
    }): Promise<PagedResponse<Tier_DETAILED>> => {
      try {
        const { data, error } = await api.tier.search({
          pagination,
          filters: {
            ...filters,
            nameLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.nameLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch tiers due to API error");
        }

        const tiers =
          data?.tiers?.map((dto) =>
            hydrateTierFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: tiers, pagination: data.pagination ?? {} };
      } catch (error) {
        throw new Error("An error occurred while fetching tiers");
      }
    },
    [api]
  );

  return { searchTiers };
};
