import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateFactoryMultiplierFromMap } from "../../libs";
import { FactoryMultiplier_DETAILED } from "../types";

export const useFetchFactoryMultiplierById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryMultiplierById = useCallback(
    async (id: string): Promise<FactoryMultiplier_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.factoryMultiplier.getById({
          id: id,
          query: {
            lazyRelation: false,
            showFactoryMultiplier2FactoryMode: "DETAILED",
            showFactoryMultiplier2TwinClassMode: "DETAILED",
            showFactoryMultiplierMode: "DETAILED",
            showFactoryMultiplier2FeaturerMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch factory multiplier due to API error",
            error
          );
        }

        if (isUndefined(data.multiplier)) {
          throw new Error(
            "Response does not have factory mulriplier data",
            error
          );
        }

        if (data.relatedObjects) {
          return hydrateFactoryMultiplierFromMap(
            data.multiplier,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryMultiplierById, loading };
};
