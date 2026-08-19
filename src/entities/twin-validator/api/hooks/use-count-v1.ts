import { useCallback, useContext } from "react";

import type { Featurer } from "@/entities/featurer";
import type { ValidatorSet } from "@/entities/validator-set";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { TwinValidatorCountGroupField, TwinValidatorFilters } from "../types";

/** One server-aggregated validator group, hydrated with its related entity. */
export type TwinValidatorCountGroup = {
  count: number;
  twinValidatorSetId?: string;
  validatorFeaturerId?: number;
  invert?: boolean;
  active?: boolean;
  twinValidatorSet?: ValidatorSet;
  validatorFeaturer?: Featurer;
};

export function useTwinValidatorCount() {
  const api = useContext(PrivateApiContext);

  const countTwinValidators = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: TwinValidatorFilters;
      groupField: TwinValidatorCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<TwinValidatorCountGroup>> => {
      try {
        const { data, error } = await api.twinValidator.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count twin validators due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const twinValidatorSetMap = data.relatedObjects?.twinValidatorSetMap;
        const featurerMap = data.relatedObjects?.featurerMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          twinValidatorSetId: group.twinValidatorSetId,
          validatorFeaturerId: group.validatorFeaturerId,
          invert: group.invert,
          active: group.active,
          twinValidatorSet:
            group.twinValidatorSetId && twinValidatorSetMap
              ? (twinValidatorSetMap[group.twinValidatorSetId] as ValidatorSet)
              : undefined,
          validatorFeaturer:
            group.validatorFeaturerId && featurerMap
              ? (featurerMap[group.validatorFeaturerId] as Featurer)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occured while counting twin validators");
      }
    },
    [api]
  );

  return { countTwinValidators };
}
