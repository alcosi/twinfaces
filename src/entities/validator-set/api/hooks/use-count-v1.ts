import { useCallback, useContext } from "react";

import { CountResult, PrivateApiContext } from "@/shared/api";

import { ValidatorSetCountGroupField, ValidatorSetFilters } from "../types";

/** One server-aggregated validator-set group. */
export type ValidatorSetCountGroup = {
  count: number;
  invert?: boolean;
};

export function useValidatorSetCount() {
  const api = useContext(PrivateApiContext);

  const countValidatorSets = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: ValidatorSetFilters;
      groupField: ValidatorSetCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<ValidatorSetCountGroup>> => {
      try {
        const { data, error } = await api.validatorSet.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count validator sets due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          invert: group.invert,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occured while counting validator sets");
      }
    },
    [api]
  );

  return { countValidatorSets };
}
