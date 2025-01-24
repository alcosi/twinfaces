import { useCallback, useContext } from "react";
import { ApiContext } from "@/shared/api";
import { FactoryConditionSet } from "../../api";

export function useFetchFactoryConditionSetById() {
  const api = useContext(ApiContext);

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

        if (error) throw error;

        if (data.conditionSets == null || data.conditionSets.length == 0) {
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
