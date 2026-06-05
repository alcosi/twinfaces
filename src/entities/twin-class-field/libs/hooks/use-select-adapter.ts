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

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchByFilters({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ key = "", name }: TwinClassFieldV1_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
