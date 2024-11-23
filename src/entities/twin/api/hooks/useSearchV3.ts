import { ApiContext } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";
import { Twin } from "../types";

// TODO: Apply caching-strategy
export const useTwinSearchV3 = () => {
  const api = useContext(ApiContext);

  const searchTwins = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
    }: {
      search: string;
      pagination?: PaginationState;
    }): Promise<{ data: Twin[]; pageCount: number }> => {
      try {
        const { data, error } = await api.twin.search({ search, pagination });

        if (error) {
          throw new Error("Failed to fetch twins due to API error");
        }

        const twinList = data.twinList ?? [];

        const totalItems = data.pagination?.total ?? 0;
        const pageCount = Math.ceil(totalItems / pagination.pageSize);

        return { data: twinList, pageCount };
      } catch (error) {
        throw new Error("An error occurred while fetching twins");
      }
    },
    [api]
  );

  return { searchTwins };
};
