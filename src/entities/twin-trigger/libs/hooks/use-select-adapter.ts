import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import { useTwinTriggerSearch } from "../../api/hooks";
import { TwinTrigger_DETAILED } from "../../api/types";

export function useTwinTriggerSelectAdapter(): SelectAdapter<TwinTrigger_DETAILED> {
  const { searchTwinTriggers } = useTwinTriggerSearch();

  async function getById(id: string) {
    const response = await searchTwinTriggers({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: { idList: [id] },
    });
    return response.data[0];
  }

  async function getItems(search: string) {
    const response = await searchTwinTriggers({
      pagination: { pageIndex: 0, pageSize: 20 },
      filters: { nameLikeList: search ? [search] : undefined },
    });
    return response.data;
  }

  function renderItem({ id, name }: TwinTrigger_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${id}` : id;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
