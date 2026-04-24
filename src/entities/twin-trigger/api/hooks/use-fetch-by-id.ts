import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateTwinTriggerFromMap } from "../../libs";
import { TwinTrigger, TwinTrigger_DETAILED } from "../types";

export function useFetchTwinTriggerById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTwinTriggerById = useCallback(
    async (id: string): Promise<TwinTrigger_DETAILED | undefined> => {
      setIsLoading(true);

      try {
        const { data, error } = await api.twinTrigger.search({
          pagination: { pageIndex: 0, pageSize: 1 },
          filters: { idList: [id] },
        });

        if (error) {
          throw error;
        }

        if (isUndefined(data.triggers) || isEmptyArray(data.triggers)) {
          throw new Error(`Twin trigger with ID ${id} not found.`);
        }

        if (data.relatedObjects) {
          return hydrateTwinTriggerFromMap(
            data.triggers[0] as TwinTrigger,
            data.relatedObjects
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinTriggerById, isLoading };
}
