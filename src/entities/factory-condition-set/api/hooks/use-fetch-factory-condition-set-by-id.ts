import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { FactoryConditionSet } from "../../api";

export function useFetchFactoryConditionSetById() {
  const api = useContext(PrivateApiContext);

  const fetchFactoryConditionSetById = useCallback(
    async (id: string): Promise<FactoryConditionSet> => {
      try {
        const { data, error } = await api.factoryConditionSet.search({
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
          filters: {
            idList: [id],
          },
        });

        if (
          isUndefined(data?.conditionSets) ||
          isEmptyArray(data.conditionSets)
        ) {
          throw new Error(`Factory with ID ${id} not found.`);
        }

        return data.conditionSets[0]!;
      } catch (error) {
        console.error(
          `Failed to find factory condition set by ID: ${id}`,
          error
        );
        throw new Error(`Failed to find factory condition set with ID ${id}`);
      }
    },
    [api]
  );

  return { fetchFactoryConditionSetById };
}
