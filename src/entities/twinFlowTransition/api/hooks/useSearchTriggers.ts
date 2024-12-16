import {
  TwinFlowTransition,
  useFetchTwinFlowTransitionById,
} from "@/entities/twinFlowTransition";
import { ApiContext, PagedResponse } from "@/shared/api";
import { useCallback, useContext } from "react";

export const useTwinFlowTransitionTriggersSearch = (transitionId: string) => {
  const api = useContext(ApiContext);
  const { fetchTwinFlowTransitionById } = useFetchTwinFlowTransitionById();

  const fetchTriggers = useCallback(async (): Promise<
    PagedResponse<TwinFlowTransition>
  > => {
    try {
      const response = await fetchTwinFlowTransitionById(transitionId!);

      const transitions = response?.triggers ?? [];

      return { data: transitions, pagination: {} };
    } catch (error) {
      throw new Error("An error occurred while fetching triggers");
    }
  }, [api]);

  return { fetchTriggers };
};
