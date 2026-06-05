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

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTwinFlowTransitions({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name }: TwinFlowTransition_DETAILED) {
    return isPopulatedString(name) ? name : "N/A";
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
