import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinFromMap } from "../../libs";
import { Twin_DETAILED } from "../types";

// TODO: Apply caching-strategy
export const useTwinFetchByIdV2 = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTwinById = useCallback(
    async (id: string): Promise<Twin_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.twin.getById({
          id,
          query: {
            lazyRelation: false,
            showTwinMode: "DETAILED",
            showTwinClassMode: "DETAILED",
            showTwin2TwinClassMode: "DETAILED",
            showTwin2UserMode: "DETAILED",
            showTwin2StatusMode: "DETAILED",
            showTwinMarker2DataListOptionMode: "DETAILED",
            showTwinByHeadMode: "YELLOW",
            showTwinAliasMode: "C",
            showTwinTag2DataListOptionMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error("Failed to fetch twin due to API error", error);
        }

        if (isUndefined(data.twin)) {
          throw new Error("Invalid response data while fetching twin", error);
        }

        if (data.relatedObjects) {
          return hydrateTwinFromMap(data.twin, data.relatedObjects);
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinById, loading };
};
