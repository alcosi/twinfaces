import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateFactoryConditionSetFromMap } from "../../libs";
import { FactoryConditionSet } from "../types";

export function useFetchFactoryConditionSetById() {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryConditionSetById = useCallback(
    async (id: string): Promise<FactoryConditionSet> => {
      setLoading(true);

      try {
        const { data, error } = await api.factoryConditionSet.getById({
          id: id,
          query: {
            lazyRelation: false,
            showConditionSetInFactoryBranchUsagesCountMode: "SHOW",
            showConditionSetInFactoryEraserUsagesCountMode: "SHOW",
            showConditionSetInFactoryMultiplierFilterUsagesCountMode: "SHOW",
            showConditionSetInFactoryPipelineStepUsagesCountMode: "SHOW",
            showConditionSetInFactoryPipelineUsagesCountMode: "SHOW",
            showFactoryConditionSet2UserMode: "DETAILED",
            showFactoryConditionSetMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch factory condition set due to API error",
            error
          );
        }

        if (isUndefined(data.conditionSet)) {
          throw new Error(
            "Response does not have factory condition set data",
            error
          );
        }

        if (data.conditionSet && data.relatedObjects) {
          return hydrateFactoryConditionSetFromMap(
            data.conditionSet,
            data.relatedObjects
          );
        }

        return hydrateFactoryConditionSetFromMap(data.conditionSet);
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryConditionSetById, loading };
}
