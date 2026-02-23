import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateFeaturerFromMap } from "../../libs";
import { Featurer_DETAILED } from "../types";

export const useFeaturerFetchById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFeaturerById = useCallback(
    async (id: number): Promise<Featurer_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.featurer.search({
          pagination: { pageIndex: 0, pageSize: 1 },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw new Error("Failed to fetch featurer due to API error");
        }

        const featurers = data.featurerList ?? [];
        if (isUndefined(featurers[0])) {
          throw new Error("Invalid response data while fetching featurer");
        }

        const featurer = hydrateFeaturerFromMap(
          featurers[0],
          data.relatedObjects
        );

        return featurer;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFeaturerById, loading };
};
