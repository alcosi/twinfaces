import { useCallback, useContext } from "react";

import { Factory } from "@/entities/factory";
import { Featurer } from "@/entities/featurer";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { CountResult, PrivateApiContext } from "@/shared/api";

import {
  FactoryMultiplierCountGroupField,
  FactoryMultiplierFilters,
} from "../types";

/** A single server-aggregated factory multiplier group, hydrated with its related entity. */
export type FactoryMultiplierCountGroup = {
  count: number;
  factoryId?: string;
  inputTwinClassId?: string;
  multiplierFeaturerId?: number;
  active?: boolean;
  factory?: Factory;
  inputTwinClass?: TwinClass_DETAILED;
  multiplierFeaturer?: Featurer;
};

export function useFactoryMultiplierCount() {
  const api = useContext(PrivateApiContext);

  const countFactoryMultipliers = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryMultiplierFilters;
      groupField: FactoryMultiplierCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryMultiplierCountGroup>> => {
      try {
        const { data, error } = await api.factoryMultiplier.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error(
            "Failed to count factory multipliers due to API error"
          );
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryMap = data.relatedObjects?.factoryMap;
        const twinClassMap = data.relatedObjects?.twinClassMap;
        const featurerMap = data.relatedObjects?.featurerMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          factoryId: group.factoryId,
          inputTwinClassId: group.inputTwinClassId,
          multiplierFeaturerId: group.multiplierFeaturerId,
          active: group.active,
          factory:
            group.factoryId && factoryMap
              ? (factoryMap[group.factoryId] as Factory)
              : undefined,
          inputTwinClass:
            group.inputTwinClassId && twinClassMap
              ? (twinClassMap[group.inputTwinClassId] as TwinClass_DETAILED)
              : undefined,
          multiplierFeaturer:
            group.multiplierFeaturerId && featurerMap
              ? (featurerMap[group.multiplierFeaturerId] as Featurer)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occurred while counting factory multipliers");
      }
    },
    [api]
  );

  return { countFactoryMultipliers };
}
