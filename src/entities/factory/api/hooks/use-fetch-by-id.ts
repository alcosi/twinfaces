import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateFactoryFromMap } from "../../libs";
import { Factory_DETAILED } from "../types";

export const useFetchFactoryById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryById = useCallback(
    async (id: string): Promise<Factory_DETAILED | undefined> => {
      setLoading(true);
      try {
        const { data, error } = await api.factory.getById({
          id: id,
          query: {
            lazyRelation: false,
            showFactoryMode: "DETAILED",
            showFactory2UserMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error("Failed to fetch factory due to API error", error);
        }

        if (isUndefined(data.factory)) {
          throw new Error("Response does not have factory data", error);
        }

        if (data.factory && data.relatedObjects) {
          return hydrateFactoryFromMap(data.factory, data.relatedObjects);
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryById, loading };
};
