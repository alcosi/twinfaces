import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateRuleFromMap } from "../../libs";
import { RuleFilters, Rule_DETAILED } from "../types";

export function useRuleSearch() {
  const api = useContext(PrivateApiContext);

  const searchRule = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: RuleFilters;
    }): Promise<PagedResponse<Rule_DETAILED>> => {
      try {
        const { data, error } = await api.twinClass.searchRules({
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch rules due to API error");
        }

        const rules = data.fieldRules?.map((dto) =>
          hydrateRuleFromMap(dto, data.relatedObjects)
        );

        return {
          data: rules ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error("An error occured while fetching rules");
      }
    },
    [api]
  );

  return { searchRule };
}
