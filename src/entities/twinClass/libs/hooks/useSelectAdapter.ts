import {
  TwinClass_DETAILED,
  TwinClassFilters,
  useFetchTwinClassById,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { isPopulatedString, SelectAdapter } from "@/shared/libs";

export function useTwinClassSelectAdapter(): SelectAdapter<TwinClass_DETAILED> {
  const { searchTwinClasses } = useTwinClassSearchV1();
  const { fetchTwinClassById } = useFetchTwinClassById();

  async function getById(id: string) {
    const response = await fetchTwinClassById({
      id,
      query: {
        showTwinClassMode: "DETAILED",
        showTwin2TwinClassMode: "SHORT",
      },
    });

    if (!response.data?.twinClass) {
      throw new Error(`TwinClass with ID ${id} not found.`);
    }

    return response.data.twinClass as TwinClass_DETAILED;
  }

  async function getItems(search: string, filters?: TwinClassFilters) {
    const response = await searchTwinClasses({ search, filters });
    return response.data;
  }

  function renderItem({ key = "", name }: TwinClass_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as TwinClassFilters),
    renderItem,
  };
}
