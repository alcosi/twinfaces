import { useCallback, useContext } from "react";

import type { Factory } from "@/entities/factory";
import type { FactoryConditionSet } from "@/entities/factory-condition-set";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import type { TwinStatus } from "@/entities/twin-status";
import { CountResult, PrivateApiContext } from "@/shared/api";

import {
  FactoryPipelineCountGroupField,
  FactoryPipelineFilters,
} from "../types";

/** A single server-aggregated factory pipeline group, hydrated with its related entity. */
export type FactoryPipelineCountGroup = {
  count: number;
  factoryId?: string;
  inputTwinClassId?: string;
  factoryConditionSetId?: string;
  outputTwinStatusId?: string;
  nextFactoryId?: string;
  active?: boolean;
  nextFactoryLimitScope?: boolean;
  factoryConditionSetInvert?: boolean;
  factory?: Factory;
  inputTwinClass?: TwinClass_DETAILED;
  factoryConditionSet?: FactoryConditionSet;
  outputTwinStatus?: TwinStatus;
  nextFactory?: Factory;
};

export function useFactoryPipelineCount() {
  const api = useContext(PrivateApiContext);

  const countFactoryPipelines = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryPipelineFilters;
      groupField: FactoryPipelineCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryPipelineCountGroup>> => {
      try {
        const { data, error } = await api.factoryPipeline.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count factory pipelines due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryMap = data.relatedObjects?.factoryMap;
        const twinClassMap = data.relatedObjects?.twinClassMap;
        const factoryConditionSetMap =
          data.relatedObjects?.factoryConditionSetMap;
        const statusMap = data.relatedObjects?.statusMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          factoryId: group.factoryId,
          inputTwinClassId: group.inputTwinClassId,
          factoryConditionSetId: group.factoryConditionSetId,
          outputTwinStatusId: group.outputTwinStatusId,
          nextFactoryId: group.nextFactoryId,
          active: group.active,
          nextFactoryLimitScope: group.nextFactoryLimitScope,
          factoryConditionSetInvert: group.factoryConditionSetInvert,
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
          outputTwinStatus:
            group.outputTwinStatusId && statusMap
              ? (statusMap[group.outputTwinStatusId] as TwinStatus)
              : undefined,
          nextFactory:
            group.nextFactoryId && factoryMap
              ? (factoryMap[group.nextFactoryId] as Factory)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occurred while counting factory pipelines");
      }
    },
    [api]
  );

  return { countFactoryPipelines };
}
