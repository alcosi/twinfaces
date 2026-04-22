import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateStatusTriggerFromMap } from "../../libs";
import { StatusTrigger_DETAILED } from "../types";

export function useFetchStatusTriggerById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchStatusTriggerById = useCallback(
    async (id: string): Promise<StatusTrigger_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.statusTrigger.search({
          pagination: { pageIndex: 0, pageSize: 1 },
          filters: { idList: [id] },
        });

        if (error) {
          throw error;
        }

        if (
          isUndefined(data.twinStatusTriggers) ||
          isEmptyArray(data.twinStatusTriggers)
        ) {
          throw new Error(`Status trigger with ID ${id} not found.`);
        }

        if (data.relatedObjects) {
          return hydrateStatusTriggerFromMap(
            data.twinStatusTriggers[0]!,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchStatusTriggerById, isLoading };
}
