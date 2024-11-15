import { ApiContext } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { hydrateTwinFlowTransitionFromMap } from "../../libs";
import { TF_Transition_DETAILED, TwinFlowTransitionApiFilters } from "../types";

// TODO: Apply caching-strategy
export const useTwinFlowTransitionSearchV1 = () => {
  const api = useContext(ApiContext);

  async function searchTwinFlowTransitions({
    pagination = { pageIndex: 0, pageSize: 10 },
    filters = {},
  }: {
    pagination?: PaginationState;
    filters?: TwinFlowTransitionApiFilters;
  }): Promise<{ data: TF_Transition_DETAILED[]; pageCount: number }> {
    try {
      const { data, error } = await api.twinFlowTransition.search({
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
