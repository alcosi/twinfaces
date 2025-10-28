import { TwinClassFieldV1_DETAILED } from "@/entities/twin-class-field";
import { SelectAdapter } from "@/shared/libs";

import { useTwinClassFieldSearch } from "../../api/hooks";

export function useTwinClassFieldSelectAdapter(): SelectAdapter<TwinClassFieldV1_DETAILED> {
  const { searchByFilters } = useTwinClassFieldSearch();

  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as TwinClassFieldV1_DETAILED;
  }

  async function getItems(search: string) {
    const response = await searchByFilters({ search });
    return response.data;
  }

  function renderItem({ key }: TwinClassFieldV1_DETAILED) {
    return key;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
