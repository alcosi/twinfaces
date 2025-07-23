import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";

import { hydrateTwinClassFromMap } from "../../libs";
import { TwinClassFilters, TwinClass_DETAILED } from "../types";

type SearchTwinClassesArgs = {
  searchId: string;
  search?: string;
  filters?: TwinClassFilters;
  params?: Record<string, string>;
};

export const useSearchTwinClassesBySearchId = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const searchTwinClassesBySearchId = useCallback(
    async ({
      searchId,
      search,
      filters = {},
      params = {},
    }: SearchTwinClassesArgs): Promise<{ data: TwinClass_DETAILED[] }> => {
      setLoading(true);

      try {
        const { data, error } = await api.twinClass.searchBySearchId({
          searchId,
          search,
          filters,
          params,
        });

        if (error) throw error;

        const twinClasses =
          data.twinClassList?.map((dto) =>
            hydrateTwinClassFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: twinClasses,
        };
      } catch (error) {
        console.error("Failed to fetch twin classes:", error);
        throw new Error("An error occurred while fetching twin classes");
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { searchTwinClassesBySearchId, loading };
};
