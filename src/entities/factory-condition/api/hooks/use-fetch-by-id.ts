import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateFactoryConditionFromMap } from "../../libs";
import { FactoryCondition_DETAILED } from "../types";

export function useFetchFactoryConditionById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchFactoryConditionById = useCallback(
    async (id: string): Promise<FactoryCondition_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.factoryCondition.search({
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

        if (isUndefined(data?.conditions) || isEmptyArray(data.conditions)) {
          throw new Error(`Factory condition with ID ${id} not found.`);
        }
        if (data.relatedObjects) {
          return hydrateFactoryConditionFromMap(
            data.conditions[0]!,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryConditionById, isLoading };
}
