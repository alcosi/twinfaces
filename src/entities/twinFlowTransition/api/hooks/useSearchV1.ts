import { ApiContext } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { hydrateTwinFlowTransitionFromMap } from "../../libs";
import {
  TwinFlowTransition_DETAILED,
  TwinFlowTransitionFilters,
} from "../types";

// TODO: Apply caching-strategy
export const useTwinFlowTransitionSearchV1 = () => {
  const api = useContext(ApiContext);

  async function searchTwinFlowTransitions({
    search,
    pagination = { pageIndex: 0, pageSize: 10 },
    filters = {},
  }: {
    search?: string;
    pagination?: PaginationState;
    filters?: TwinFlowTransitionFilters;
  }): Promise<{ data: TwinFlowTransition_DETAILED[]; pageCount: number }> {
    try {
      const { data, error } = await api.twinFlowTransition.search({
        search,
        pagination,
        filters,
      });

      if (error) {
        console.error("Failed to fetch transitions due to API error:", error);
        throw new Error("Failed to fetch transitions due to API error");
      }

      const transitions =
        data.transition?.map((dto) =>
          hydrateTwinFlowTransitionFromMap(dto, data.relatedObjects)
        ) ?? [];

      const totalItems = data.pagination?.total ?? 0;
      const pageCount = Math.ceil(totalItems / pagination.pageSize);

      return { data: transitions, pageCount };
    } catch (error) {
      throw new Error("An error occurred while fetching transitions");
    }
  }

  return { searchTwinFlowTransitions };
};
