import { useCallback, useContext, useState } from "react";

import {
  TwinFlow_DETAILED,
  hydrateTwinFlowFromMap,
} from "@/entities/twin-flow";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useTwinFlowFetchByIdV1 = () => {
  const api = useContext(PrivateApiContext);

  const [loading, setLoading] = useState<boolean>(false);

  const fetchTwinFlowById = useCallback(
    async (id: string): Promise<TwinFlow_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinFlow.getById({
          twinFlowId: id,
        });

        if (error) {
          throw new Error("Failed to fetch twin flow due to API error");
        }

        if (isUndefined(data.twinflow)) {
          throw new Error("Invalid response data while fetching twin flow");
        }

        const twinflow = hydrateTwinFlowFromMap(
          data.twinflow,
          data.relatedObjects
        );

        return twinflow;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinFlowById, loading };
};
