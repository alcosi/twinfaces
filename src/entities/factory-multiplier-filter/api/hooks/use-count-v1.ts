import { useCallback, useContext } from "react";

import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryMultiplier_DETAILED } from "@/entities/factory-multiplier";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { CountResult, PrivateApiContext } from "@/shared/api";

import {
  FactoryMultiplierFilterCountGroupField,
  FactoryMultiplierFilterFilters,
} from "../types";

/** A single server-aggregated factory multiplier filter group, hydrated with its related entity. */
export type FactoryMultiplierFilterCountGroup = {
  count: number;
  factoryMultiplierId?: string;
  inputTwinClassId?: string;
  factoryConditionSetId?: string;
  active?: boolean;
  factoryConditionSetInvert?: boolean;
  multiplier?: FactoryMultiplier_DETAILED;
  inputTwinClass?: TwinClass_DETAILED;
  factoryConditionSet?: FactoryConditionSet;
};

export function useFactoryMultiplierFilterCount() {
  const api = useContext(PrivateApiContext);

  const countFactoryMultiplierFilters = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryMultiplierFilterFilters;
      groupField: FactoryMultiplierFilterCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryMultiplierFilterCountGroup>> => {
      try {
        const { data, error } = await api.factoryMultiplierFilter.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error(
            "Failed to count factory multiplier filters due to API error"
          );
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryMultiplierMap = data.relatedObjects?.factoryMultiplierMap;
        const twinClassMap = data.relatedObjects?.twinClassMap;
        const factoryConditionSetMap =
          data.relatedObjects?.factoryConditionSetMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          factoryMultiplierId: group.factoryMultiplierId,
          inputTwinClassId: group.inputTwinClassId,
          factoryConditionSetId: group.factoryConditionSetId,
          active: group.active,
          factoryConditionSetInvert: group.factoryConditionSetInvert,
          multiplier:
            group.factoryMultiplierId && factoryMultiplierMap
              ? (factoryMultiplierMap[
                  group.factoryMultiplierId
                ] as FactoryMultiplier_DETAILED)
              : undefined,
          inputTwinClass:
            group.inputTwinClassId && twinClassMap
              ? (twinClassMap[group.inputTwinClassId] as TwinClass_DETAILED)
              : undefined,
          factoryConditionSet:
            group.factoryConditionSetId && factoryConditionSetMap
              ? (factoryConditionSetMap[
                  group.factoryConditionSetId
                ] as FactoryConditionSet)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error(
          "An error occurred while counting factory multiplier filters"
        );
      }
    },
    [api]
  );

  return { countFactoryMultiplierFilters };
}
