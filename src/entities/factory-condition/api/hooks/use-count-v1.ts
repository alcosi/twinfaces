import { useCallback, useContext } from "react";

import type { FactoryConditionSet } from "@/entities/factory-condition-set";
import type { Featurer } from "@/entities/featurer";
import { CountResult, PrivateApiContext } from "@/shared/api";

import {
  FactoryConditionCountGroupField,
  FactoryConditionFilters,
} from "../types";

/** A single server-aggregated factory condition group, hydrated with its related entity. */
export type FactoryConditionCountGroup = {
  count: number;
  factoryConditionSetId?: string;
  conditionerFeaturerId?: number;
  invert?: boolean;
  active?: boolean;
  factoryConditionSet?: FactoryConditionSet;
  conditionerFeaturer?: Featurer;
};

export function useFactoryConditionCount() {
  const api = useContext(PrivateApiContext);

  const countFactoryConditions = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryConditionFilters;
      groupField: FactoryConditionCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryConditionCountGroup>> => {
      try {
        const { data, error } = await api.factoryCondition.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error(
            "Failed to count factory conditions due to API error"
          );
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryConditionSetMap =
          data.relatedObjects?.factoryConditionSetMap;
        const featurerMap = data.relatedObjects?.featurerMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          factoryConditionSetId: group.factoryConditionSetId,
          conditionerFeaturerId: group.conditionerFeaturerId,
          invert: group.invert,
          active: group.active,
          factoryConditionSet:
            group.factoryConditionSetId && factoryConditionSetMap
              ? (factoryConditionSetMap[
                  group.factoryConditionSetId
                ] as FactoryConditionSet)
              : undefined,
          conditionerFeaturer:
            group.conditionerFeaturerId && featurerMap
              ? (featurerMap[group.conditionerFeaturerId] as Featurer)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occured while counting factory conditions");
      }
    },
    [api]
  );

  return { countFactoryConditions };
}
