import { TwinFlow_DETAILED } from "@/entities/twinFlow";
import { SelectAdapter } from "@/shared/libs";

export function useTwinFlowSelectAdapter(): SelectAdapter<TwinFlow_DETAILED> {
  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as TwinFlow_DETAILED;
  }

  async function getItems(search: string) {
    // TODO: Apply valid logic here
    return [];
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
