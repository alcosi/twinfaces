import { TwinClassFieldV1_DETAILED } from "@/entities/twin-class-field";
import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import {
  useFetchTwinClassFieldById,
  useTwinClassFieldSearch,
} from "../../api/hooks";

export function useTwinClassFieldSelectAdapter(): SelectAdapter<TwinClassFieldV1_DETAILED> {
  const { searchByFilters } = useTwinClassFieldSearch();
  const { fetchTwinClassFieldById } = useFetchTwinClassFieldById();

  async function getById(id: string) {
    return await fetchTwinClassFieldById(id);
  }

  async function getItems(search: string) {
    const response = await searchByFilters({ search });
    return response.data;
  }

  function renderItem({ key = "", name }: TwinClassFieldV1_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
