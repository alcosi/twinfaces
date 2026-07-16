import { useCallback, useContext } from "react";

import type { Factory } from "@/entities/factory";
import type { FactoryConditionSet } from "@/entities/factory-condition-set";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { FactoryBranchCountGroupField, FactoryBranchFilters } from "../types";

/** A single server-aggregated factory branch group, hydrated with its related entity. */
export type FactoryBranchCountGroup = {
  count: number;
  factoryId?: string;
  factoryConditionSetId?: string;
  nextFactoryId?: string;
  active?: boolean;
  factoryConditionSetInvert?: boolean;
  factory?: Factory;
  factoryConditionSet?: FactoryConditionSet;
  nextFactory?: Factory;
};

export function useFactoryBranchCount() {
  const api = useContext(PrivateApiContext);

  const countFactoryBranches = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryBranchFilters;
      groupField: FactoryBranchCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryBranchCountGroup>> => {
      try {
        const { data, error } = await api.factoryBranch.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count factory branches due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryMap = data.relatedObjects?.factoryMap;
        const factoryConditionSetMap =
          data.relatedObjects?.factoryConditionSetMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          factoryId: group.factoryId,
          factoryConditionSetId: group.factoryConditionSetId,
          nextFactoryId: group.nextFactoryId,
          active: group.active,
          factoryConditionSetInvert: group.factoryConditionSetInvert,
          factory:
            group.factoryId && factoryMap
              ? (factoryMap[group.factoryId] as Factory)
              : undefined,
          factoryConditionSet:
            group.factoryConditionSetId && factoryConditionSetMap
              ? (factoryConditionSetMap[
                  group.factoryConditionSetId
                ] as FactoryConditionSet)
              : undefined,
          nextFactory:
            group.nextFactoryId && factoryMap
              ? (factoryMap[group.nextFactoryId] as Factory)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occured while counting factory branches");
      }
    },
    [api]
  );

  return { countFactoryBranches };
}
