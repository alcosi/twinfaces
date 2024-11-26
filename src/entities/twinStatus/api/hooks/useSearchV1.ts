import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { TwinStatus, TwinStatusFilters } from "../../api";

// TODO: Apply caching-strategy after discussing with team
export const useTwinStatusSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchTwinStatuses = useCallback(
    async ({
      filters,
    }: {
      filters: TwinStatusFilters;
    }): Promise<{
      data: TwinStatus[];
      pageCount: number;
    }> => {
      const { data, error } = await api.twinStatus.search({ filters });

      if (error) {
        throw new Error("Failed to fetch statuses due to API error");
      }

      return { data: data.statuses ?? [], pageCount: 0 };
    },
    [api]
  );

  return { searchTwinStatuses };
};
