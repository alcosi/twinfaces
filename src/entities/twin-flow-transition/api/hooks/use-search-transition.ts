import { PaginationState } from "@tanstack/react-table";
import { useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateTwinFlowTransitionFromMap } from "../../libs";
import {
  TwinFlowTransitionFilters,
  TwinFlowTransition_DETAILED,
} from "../types";

export const useTwinFlowTransitionSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  async function searchTwinFlowTransitions({
    search,
    pagination = { pageIndex: 0, pageSize: 10 },
    filters = {},
  }: {
    search?: string;
    pagination?: PaginationState;
    filters?: TwinFlowTransitionFilters;
  }): Promise<PagedResponse<TwinFlowTransition_DETAILED>> {
    try {
      const { data, error } = await api.twinFlowTransition.search({
        search,
        pagination,
        filters,
      });

      if (error) {
        throw new Error("Failed to fetch transitions due to API error");
      }

      const transitions =
        data.transition?.map((dto) =>
          hydrateTwinFlowTransitionFromMap(dto, data.relatedObjects)
        ) ?? [];

      return { data: transitions, pagination: data.pagination ?? {} };
    } catch (error) {
      throw new Error("An error occurred while fetching transitions");
    }
  }

  return { searchTwinFlowTransitions };
};
