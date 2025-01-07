import {
  TwinFlowTransitionValidator,
  useFetchTwinFlowTransitionById,
} from "@/entities/twinFlowTransition";
import { ApiContext, PagedResponse } from "@/shared/api";
import { useCallback, useContext } from "react";

export const useTwinFlowTransitionValidatorRulesSearch = () => {
  const api = useContext(ApiContext);
  const { fetchTwinFlowTransitionById } = useFetchTwinFlowTransitionById();

  const fetchValidatorRules = useCallback(
    async ({
      transitionId,
    }: {
      transitionId: string;
    }): Promise<PagedResponse<TwinFlowTransitionValidator>> => {
      try {
        const response = await fetchTwinFlowTransitionById(transitionId);
        const validatorRules = response?.validatorRules ?? [];

        return { data: validatorRules, pagination: {} };
      } catch (error) {
        throw new Error("An error occurred while fetching validator rules");
      }
    },
    [api]
  );

  return { fetchValidatorRules };
};
