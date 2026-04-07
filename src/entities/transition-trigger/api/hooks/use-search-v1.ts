import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTransitionTriggerFromMap } from "../../libs";
import { TransitionTriggerFilters, TransitionTrigger_DETAILED } from "../types";

export function useTransitionTriggerSearch() {
  const api = useContext(PrivateApiContext);

  const searchTransitionTriggers = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: TransitionTriggerFilters;
    }): Promise<PagedResponse<TransitionTrigger_DETAILED>> => {
      try {
        const { data, error } = await api.transitionTrigger.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const triggers =
          data.triggers?.map((dto) =>
            hydrateTransitionTriggerFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: triggers,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch transition triggers:", error);
        throw new Error(
          "An error occured while fetching transition triggers: " + error
        );
      }
    },
    [api]
  );

  return { searchTransitionTriggers };
}
