import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateTransitionTriggerFromMap } from "../../libs";
import { TransitionTrigger_DETAILED } from "../types";

export function useFetchTransitionTriggerById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchTransitionTriggerById = useCallback(
    async (id: string): Promise<TransitionTrigger_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.transitionTrigger.search({
          pagination: { pageIndex: 0, pageSize: 1 },
          filters: { idList: [id] },
        });

        if (error) {
          throw error;
        }

        if (isUndefined(data.triggers) || isEmptyArray(data.triggers)) {
          throw new Error(`Transition trigger with ID ${id} not found.`);
        }

        if (data.relatedObjects) {
          return hydrateTransitionTriggerFromMap(
            data.triggers[0]!,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTransitionTriggerById, isLoading };
}
