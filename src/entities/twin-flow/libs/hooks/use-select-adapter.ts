import {
  TwinFlow_DETAILED,
  useTwinFlowFetchByIdV1,
  useTwinFlowSearchV1,
} from "@/entities/twin-flow";
import { SelectAdapter, isEmptyString } from "@/shared/libs";

export function useTwinFlowSelectAdapter(): SelectAdapter<TwinFlow_DETAILED> {
  const { searchTwinFlows } = useTwinFlowSearchV1();
  const { fetchTwinFlowById } = useTwinFlowFetchByIdV1();

  async function getById(id: string) {
    const response = await fetchTwinFlowById(id);
    return response as TwinFlow_DETAILED;
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTwinFlows({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name, id }: TwinFlow_DETAILED) {
    return !isEmptyString(name) ? name : id;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
