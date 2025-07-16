import { useCallback, useContext } from "react";

import {
  TwinFlowTransitionTrigger,
  useFetchTwinFlowTransitionById,
} from "@/entities/twin-flow-transition";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useTwinFlowTransitionTriggersSearch = () => {
  const api = useContext(PrivateApiContext);
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
