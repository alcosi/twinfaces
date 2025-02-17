import { ApiContext } from "@/shared/api";
import { useCallback, useContext, useState } from "react";
import { Factory_DETAILED } from "./types";
import { hydrateFactoryFromMap } from "../libs";
import { isUndefined } from "@/shared/libs";

export const useFetchFactoryData = () => {
  const api = useContext(ApiContext);
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

        if (data?.factory && data.relatedObjects) {
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
