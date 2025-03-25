import {
  TwinFlow_DETAILED,
  useTwinFlowFetchByIdV1,
  useTwinFlowSearchV1,
} from "@/entities/twin-flow";
import { SelectAdapter } from "@/shared/libs";

export function useTwinFlowSelectAdapter(): SelectAdapter<TwinFlow_DETAILED> {
  const { searchTwinFlows } = useTwinFlowSearchV1();
  const { fetchTwinFlowById } = useTwinFlowFetchByIdV1();

  async function getById(id: string) {
    const response = await fetchTwinFlowById(id);
    return response as TwinFlow_DETAILED;
  }

  async function getItems(search: string) {
    const response = await searchTwinFlows({ search });
    return response.data;
  }

  function renderItem({ name }: TwinFlow_DETAILED) {
    return name;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
