import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateFactoryBranchFromMap } from "../../libs";
import { FactoryBranch_DETAILED } from "../types";

export const useFetchFactoryBranchById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryBranchById = useCallback(
    async (id: string): Promise<FactoryBranch_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.factoryBranch.getById({
          id: id,
          query: {
            lazyRelation: false,
            showFactoryBranch2FactoryMode: "DETAILED",
            showFactoryBranchMode: "DETAILED",
            showFactoryBranch2FactoryConditionSetMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch factory branch due to API error",
            error
          );
        }

        if (isUndefined(data.branch)) {
          throw new Error("Response does not have factory branch data", error);
        }

        if (data.relatedObjects) {
          return hydrateFactoryBranchFromMap(data.branch, data.relatedObjects);
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryBranchById, loading };
};
