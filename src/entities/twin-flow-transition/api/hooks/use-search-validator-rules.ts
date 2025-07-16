import { useCallback, useContext } from "react";

import {
  TwinFlowTransitionValidator,
  useFetchTwinFlowTransitionById,
} from "@/entities/twin-flow-transition";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useTwinFlowTransitionValidatorRulesSearch = () => {
  const api = useContext(PrivateApiContext);
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
