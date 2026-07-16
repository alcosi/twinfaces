import { useCallback, useContext } from "react";

import type { FactoryConditionSet } from "@/entities/factory-condition-set";
import type { FactoryPipeline } from "@/entities/factory-pipeline";
import type { Featurer } from "@/entities/featurer";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { PipelineStepCountGroupField, PipelineStepFilters } from "../types";

/** A single server-aggregated pipeline step group, hydrated with its related entity. */
export type PipelineStepCountGroup = {
  count: number;
  factoryPipelineId?: string;
  factoryConditionSetId?: string;
  fillerFeaturerId?: number;
  active?: boolean;
  optional?: boolean;
  factoryConditionInvert?: boolean;
  factoryPipeline?: FactoryPipeline;
  factoryConditionSet?: FactoryConditionSet;
  fillerFeaturer?: Featurer;
};

export function usePipelineStepCount() {
  const api = useContext(PrivateApiContext);

  const countPipelineStep = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: PipelineStepFilters;
      groupField: PipelineStepCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<PipelineStepCountGroup>> => {
      try {
        const { data, error } = await api.pipelineStep.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count pipeline steps due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryPipelineMap = data.relatedObjects?.factoryPipelineMap;
        const factoryConditionSetMap =
          data.relatedObjects?.factoryConditionSetMap;
        const featurerMap = data.relatedObjects?.featurerMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          factoryPipelineId: group.factoryPipelineId,
          factoryConditionSetId: group.factoryConditionSetId,
          fillerFeaturerId: group.fillerFeaturerId,
          active: group.active,
          optional: group.optional,
          factoryConditionInvert: group.factoryConditionInvert,
          factoryPipeline:
            group.factoryPipelineId && factoryPipelineMap
              ? (factoryPipelineMap[group.factoryPipelineId] as FactoryPipeline)
              : undefined,
          factoryConditionSet:
            group.factoryConditionSetId && factoryConditionSetMap
              ? (factoryConditionSetMap[
                  group.factoryConditionSetId
                ] as FactoryConditionSet)
              : undefined,
          fillerFeaturer:
            group.fillerFeaturerId && featurerMap
              ? (featurerMap[group.fillerFeaturerId] as Featurer)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occured while counting pipeline steps");
      }
    },
    [api]
  );

  return { countPipelineStep };
}
