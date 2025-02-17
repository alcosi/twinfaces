import { TwinFlow_DETAILED, useTwinFlowSearchV1 } from "@/entities/twinFlow";
import { SelectAdapter } from "@/shared/libs";

export function useTwinFlowSelectAdapter(): SelectAdapter<TwinFlow_DETAILED> {
  const { searchTwinFlows } = useTwinFlowSearchV1();

  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as TwinFlow_DETAILED;
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
