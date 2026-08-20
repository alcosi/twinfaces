import { useCallback, useContext } from "react";

import type { Factory } from "@/entities/factory";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import type { TwinTrigger } from "@/entities/twin-trigger";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { FactoryTriggerCountGroupField, FactoryTriggerFilters } from "../types";

/** One server-aggregated factory-trigger group, hydrated with its relations. */
export type FactoryTriggerCountGroup = {
  count: number;
  twinFactoryId?: string;
  inputTwinClassId?: string;
  twinTriggerId?: string;
  active?: boolean;
  async?: boolean;
  twinFactoryConditionInvert?: boolean;
  factory?: Factory;
  inputTwinClass?: TwinClass_DETAILED;
  twinTrigger?: TwinTrigger;
};

export function useFactoryTriggerCount() {
  const api = useContext(PrivateApiContext);

  const countFactoryTriggers = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryTriggerFilters;
      groupField: FactoryTriggerCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryTriggerCountGroup>> => {
      try {
        const { data, error } = await api.factoryTrigger.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count factory triggers due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryMap = data.relatedObjects?.factoryMap;
        const twinClassMap = data.relatedObjects?.twinClassMap;
        // Twin triggers arrive under `triggerMap`, not `twinTriggerMap`.
        const triggerMap = data.relatedObjects?.triggerMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          twinFactoryId: group.twinFactoryId,
          inputTwinClassId: group.inputTwinClassId,
          twinTriggerId: group.twinTriggerId,
          active: group.active,
          async: group.async,
          twinFactoryConditionInvert: group.twinFactoryConditionInvert,
          factory:
            group.twinFactoryId && factoryMap
              ? (factoryMap[group.twinFactoryId] as Factory)
              : undefined,
          inputTwinClass:
            group.inputTwinClassId && twinClassMap
              ? (twinClassMap[group.inputTwinClassId] as TwinClass_DETAILED)
              : undefined,
          twinTrigger:
            group.twinTriggerId && triggerMap
              ? (triggerMap[group.twinTriggerId] as TwinTrigger)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occured while counting factory triggers");
      }
    },
    [api]
  );

  return { countFactoryTriggers };
}
