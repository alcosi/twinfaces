import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateTierFromMap } from "../../libs";
import { Tier_DETAILED } from "../types";

export function useFetchTierById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchTierById = useCallback(
    async (id: string): Promise<Tier_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.tier.search({
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw error;
        }

        if (isUndefined(data.tiers) || isEmptyArray(data.tiers)) {
          throw new Error(`Tier with ID ${id} not found.`);
        }

        if (data.relatedObjects) {
          return hydrateTierFromMap(data.tiers[0]!, data.relatedObjects);
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTierById, isLoading };
}
