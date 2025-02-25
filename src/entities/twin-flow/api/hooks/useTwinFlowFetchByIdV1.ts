import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext, useState } from "react";
import { TwinFlow } from "../types";

// TODO: Apply caching-strategy
export const useTwinFlowFetchByIdV1 = () => {
  const api = useContext(PrivateApiContext);
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTwinFlowById = useCallback(
    async (id: string): Promise<TwinFlow> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinFlow.getById({
          twinFlowId: id,
        });

        if (error) {
          throw new Error("Failed to fetch twin flows due to API error");
        }

        if (isUndefined(data.twinflow)) {
          throw new Error("Invalid response data while fetching twin flows");
        }

        return data.twinflow;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinFlowById, loading };
};
