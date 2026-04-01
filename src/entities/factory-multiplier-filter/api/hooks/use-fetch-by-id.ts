import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateFactoryMultiplierFilterFromMap } from "../../libs";
import { FactoryMultiplierFilter_DETAILED } from "../types";

export const useFetchFactoryMultiplierFilterById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryMultiplierFilterById = useCallback(
    async (
      id: string
    ): Promise<FactoryMultiplierFilter_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.factoryMultiplierFilter.getById({
          id: id,
          query: {
            lazyRelation: false,
            showFactoryMultiplierFilterMode: "DETAILED",
            showFactoryMultiplierFilter2TwinClassMode: "DETAILED",
            showFactoryMultiplierFilter2FactoryMultiplierMode: "DETAILED",
            showFactoryMultiplierFilter2FactoryConditionSetMode: "DETAILED",
            showFeaturerParamMode: "SHOW",
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch factory multiplier filter due to API error",
            error
          );
        }

        if (isUndefined(data.multiplierFilter)) {
          throw new Error(
            "Response does not have factory multiplier filter data",
            error
          );
        }

        if (data.relatedObjects) {
          return hydrateFactoryMultiplierFilterFromMap(
            data.multiplierFilter,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryMultiplierFilterById, loading };
};
