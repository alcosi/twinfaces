import { useCallback, useContext, useState } from "react";

import {
  FactoryTrigger_DETAILED,
  hydrateFactoryTriggerFromMap,
} from "@/entities/factory-trigger";
import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

export function useFetchFactoryTriggerById() {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryTriggerById = useCallback(
    async (id: string): Promise<FactoryTrigger_DETAILED | undefined> => {
      setLoading(true);
      try {
        const { data, error } = await api.factoryTrigger.search({
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

        if (
          isUndefined(data?.twinFactoryTriggers) ||
          isEmptyArray(data.twinFactoryTriggers)
        ) {
          throw new Error(`Factory trigger with ID ${id} not found.`);
        }
        if (data.relatedObjects) {
          return hydrateFactoryTriggerFromMap(
            data.twinFactoryTriggers[0]!,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryTriggerById, loading };
}
