import {
  TwinFlowTransitionTrigger,
  useFetchTwinFlowTransitionById,
} from "@/entities/twinFlowTransition";
import { ApiContext, PagedResponse } from "@/shared/api";
import { useCallback, useContext } from "react";

export const useTwinFlowTransitionTriggersSearch = () => {
  const api = useContext(ApiContext);
  const { fetchTwinFlowTransitionById } = useFetchTwinFlowTransitionById();

  const fetchTriggers = useCallback(
    async ({
      transitionId,
    }: {
      transitionId: string;
    }): Promise<PagedResponse<TwinFlowTransitionTrigger>> => {
      try {
        const response = await fetchTwinFlowTransitionById(transitionId);

        const triggers = response?.triggers ?? [];

        return { data: triggers, pagination: {} };
      } catch (error) {
        throw new Error("An error occurred while fetching triggers");
      }
    },
    [api]
  );

  return { fetchTriggers };
};
