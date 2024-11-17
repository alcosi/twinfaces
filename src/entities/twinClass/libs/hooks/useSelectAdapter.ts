import {
  TwinClass_DETAILED,
  useFetchTwinClassById,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { SelectAdapter } from "@/shared/libs";

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

  async function getItems(search: string) {
    const response = await searchTwinClasses({ search });
    return response.data;
  }

  function getItemKey(item: TwinClass_DETAILED) {
    return item.id;
  }

  function getItemLabel({ key = "", name }: TwinClass_DETAILED) {
    return `${key}${name ? ` (${name})` : ""}`;
  }

  return {
    getById,
    getItems,
    getItemKey,
    getItemLabel,
  };
}
