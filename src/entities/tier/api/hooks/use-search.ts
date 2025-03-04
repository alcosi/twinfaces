import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { hydrateTierFromMap } from "@/entities/tier";
import { ApiContext, PagedResponse } from "@/shared/api";

import { TierFilters, Tier_DETAILED } from "../types";

// TODO: Apply caching-strategy
export const useTierSearch = () => {
  const api = useContext(ApiContext);

  const searchTiers = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      pagination?: PaginationState;
      filters?: TierFilters;
    }): Promise<PagedResponse<Tier_DETAILED>> => {
      try {
        const { data, error } = await api.tier.search({
          pagination,
          filters,
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
