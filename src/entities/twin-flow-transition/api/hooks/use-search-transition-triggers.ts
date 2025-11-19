import { PaginationState } from "@tanstack/react-table";
import { useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { TransitionTriggersFilters, TwinFlowTransitionTrigger } from "../types";

export const useTwinFlowTransitionTriggersSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  async function searchTwinFlowTransitionTriggers({
    pagination = { pageIndex: 0, pageSize: 10 },
    filters = {},
  }: {
    pagination?: PaginationState;
    filters?: TransitionTriggersFilters;
  }): Promise<PagedResponse<TwinFlowTransitionTrigger>> {
    try {
      const { data, error } = await api.twinFlowTransition.searchTriggers({
        pagination,
        filters,
      });

      if (error) {
        throw new Error("Failed to fetch transition triggers due to API error");
      }

      const triggers = data.triggers ?? [];

      return {
        data: triggers,
        pagination: data.pagination ?? {},
      };
    } catch {
      throw new Error("An error occurred while fetching transition triggers");
    }
  }

  return { searchTwinFlowTransitionTriggers };
};
