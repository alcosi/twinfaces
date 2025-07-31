import { TwinClassFieldV2_DETAILED } from "@/entities/twin-class-field";
import { SelectAdapter } from "@/shared/libs";

import { useTwinClassFieldSearch } from "../../api/hooks";

export function useTwinClassFieldSelectAdapter(): SelectAdapter<TwinClassFieldV2_DETAILED> {
  const { searchTwinClassFields } = useTwinClassFieldSearch();

  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as TwinClassFieldV2_DETAILED;
  }

  async function getItems(search: string) {
    const response = await searchTwinClassFields({ search });
    return response.data;
  }

  function renderItem({ key }: TwinClassFieldV2_DETAILED) {
    return key;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
