import { useCallback, useContext, useState } from "react";

import { hydrateTwinFlowTransitionFromMap } from "@/entities/twin-flow-transition";
import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { TwinFlowTransition } from "../types";

// TODO: Apply caching-strategy after discussing with team
export const useFetchTwinFlowTransitionById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(ApiContext);

  const fetchTwinFlowTransitionById = useCallback(
    async (id: string): Promise<TwinFlowTransition> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinFlowTransition.fetchById(id);

        if (error) {
          throw new Error(
            "Failed to fetch twin-flow-transition due to API error",
            error
          );
        }

        if (isUndefined(data.transition)) {
          throw new Error(`Twin-flow-transition with ID ${id} not found`);
        }

        const transition = hydrateTwinFlowTransitionFromMap(
          data.transition,
          data.relatedObjects
        );

        return transition;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinFlowTransitionById, loading };
};
