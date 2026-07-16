import { useCallback, useContext } from "react";

import type { Factory } from "@/entities/factory";
import type { FactoryConditionSet } from "@/entities/factory-condition-set";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import { CountResult, PrivateApiContext } from "@/shared/api";

import {
  FactoryEraserAction,
  FactoryEraserCountGroupField,
  FactoryEraserFilters,
} from "../types";

/** A single server-aggregated factory eraser group, hydrated with its related entity. */
export type FactoryEraserCountGroup = {
  count: number;
  factoryId?: string;
  inputTwinClassId?: string;
  factoryConditionSetId?: string;
  factoryConditionSetInvert?: boolean;
  active?: boolean;
  action?: FactoryEraserAction;
  factory?: Factory;
  inputTwinClass?: TwinClass_DETAILED;
  factoryConditionSet?: FactoryConditionSet;
};

export function useFactoryEraserCount() {
  const api = useContext(PrivateApiContext);

  const countFactoryErasers = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryEraserFilters;
      groupField: FactoryEraserCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryEraserCountGroup>> => {
      try {
        const { data, error } = await api.factoryEraser.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count factory erasers due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryMap = data.relatedObjects?.factoryMap;
        const twinClassMap = data.relatedObjects?.twinClassMap;
        const factoryConditionSetMap =
          data.relatedObjects?.factoryConditionSetMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          factoryId: group.factoryId,
          inputTwinClassId: group.inputTwinClassId,
          factoryConditionSetId: group.factoryConditionSetId,
          factoryConditionSetInvert: group.factoryConditionSetInvert,
          active: group.active,
          action: group.action,
          factory:
            group.factoryId && factoryMap
              ? (factoryMap[group.factoryId] as Factory)
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
        throw new Error("An error occured while counting factory erasers");
      }
    },
    [api]
  );

  return { countFactoryErasers };
}
