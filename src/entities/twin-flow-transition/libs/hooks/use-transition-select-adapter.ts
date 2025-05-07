import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import {
  TwinFlowTransition_DETAILED,
  useFetchTwinFlowTransitionById,
  useTwinFlowTransitionSearchV1,
} from "../../api";

export function useTransitionSelectAdapter(): SelectAdapter<TwinFlowTransition_DETAILED> {
  const { searchTwinFlowTransitions } = useTwinFlowTransitionSearchV1();
  const { fetchTwinFlowTransitionById } = useFetchTwinFlowTransitionById();

  async function getById(id: string) {
    const twinFlowTransition = await fetchTwinFlowTransitionById(id);
    return twinFlowTransition as TwinFlowTransition_DETAILED;
  }

  async function getItems(search: string) {
    const response = await searchTwinFlowTransitions({ search });
    return response.data;
  }

  function renderItem({ name }: TwinFlowTransition_DETAILED) {
    return isPopulatedString(name) ? name : "N/A";
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
