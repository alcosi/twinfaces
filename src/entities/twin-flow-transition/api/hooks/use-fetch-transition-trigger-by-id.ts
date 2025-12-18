import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateTwinFlowTransitionTriggerFromMap } from "../../libs";
import { TwinFlowTransitionTrigger } from "../types";

export function useFetchTransitionTriggerById() {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(PrivateApiContext);

  const fetchTransitionTriggerById = useCallback(
    async (id: string): Promise<TwinFlowTransitionTrigger> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinFlowTransition.searchTriggers({
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw error;
        }

        if (isUndefined(data?.triggers) || isEmptyArray(data.triggers)) {
          throw new Error(`Transition trigger with ID ${id} not found.`);
        }

        const trigger = hydrateTwinFlowTransitionTriggerFromMap(
          data.triggers[0]!,
          data.relatedObjects
        );
        return trigger;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTransitionTriggerById, loading };
}
