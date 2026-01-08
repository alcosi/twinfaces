import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinFlowFactoryFromMap } from "../../libs";
import { TwinFlowFactory_DETAILED } from "../types";

export const useTwinFlowFactoryFetchByIdV1 = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTwinFlowFactoryById = useCallback(
    async (twinflowFactoryId: string): Promise<TwinFlowFactory_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinFlowFactory.getById({
          twinflowFactoryId,
        });

        if (error) {
          throw new Error("Failed to fetch twinflow factory due to API error");
        }

        if (isUndefined(data.twinflowFactory)) {
          throw new Error(
            "Invalid response data while fetching twinflow factory"
          );
        }

        const twinflowFactory = hydrateTwinFlowFactoryFromMap(
          data.twinflowFactory,
          data.relatedObjects
        );

        return twinflowFactory;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinFlowFactoryById, loading };
};
