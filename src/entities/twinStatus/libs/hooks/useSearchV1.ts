import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { TwinStatus } from "../../api";

// TODO: Apply caching-strategy after discussing with team
export const useTwinStatusSearchV1 = () => {
  const api = useContext(ApiContext);

  const searchTwinStatuses = useCallback(
    async ({
      twinClassId,
      search,
    }: {
      twinClassId?: string;
      search?: string;
    }): Promise<{
      data: TwinStatus[];
      pageCount: number;
    }> => {
      const { data, error } = await api.twinStatus.search({
        twinClassId,
        search,
      });

      if (error) {
        throw new Error("Failed to fetch statuses due to API error");
      }

      const statuses =
        Object.values(data.relatedObjects?.statusMap || {}) ?? [];

      return { data: statuses, pageCount: 0 };
    },
    [api]
  );

  return { searchTwinStatuses };
};
