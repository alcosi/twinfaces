import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";

import { hydrateTwinClassFieldFromMap } from "../../libs";
import { TwinClassFieldV2_DETAILED } from "../types";

type SearchTwinClassFieldsArgs = {
  searchId: string;
  twinClassId: string;
  params?: Record<string, string>;
};

export const useSearchTwinClassFieldsBySearchId = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const searchTwinClassFieldsBySearchId = useCallback(
    async ({
      searchId,
      twinClassId,
      params = {},
    }: SearchTwinClassFieldsArgs): Promise<{
      data: TwinClassFieldV2_DETAILED[];
    }> => {
      setLoading(true);

      try {
        const { data, error } = await api.twinClassField.searchBySearchId({
          searchId,
          twinClassId,
          params,
        });

        if (error) throw error;

        const twinClassFields =
          data.fields?.map((dto) =>
            hydrateTwinClassFieldFromMap(dto, data.relatedObjects)
          ) ?? [];

        return { data: twinClassFields };
      } catch (error) {
        console.error("Failed to fetch twin class fields:", error);
        throw new Error("An error occurred while fetching twin class fields");
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { searchTwinClassFieldsBySearchId, loading };
};
