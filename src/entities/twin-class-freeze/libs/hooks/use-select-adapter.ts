import {
  TwinClassFreeze,
  useTwinClassFreezeSearch,
} from "@/entities/twin-class-freeze";
import { SelectAdapter, isPopulatedString } from "@/shared/libs";

export function useTwinClassFreezeSelectAdapter(): SelectAdapter<TwinClassFreeze> {
  const { searchTwinClassFreezes } = useTwinClassFreezeSearch();

  async function getById(id: string) {
    const response = await searchTwinClassFreezes({
      filters: {
        idList: [id],
      },
    });
    return response.data[0];
  }

  async function getItems(search: string) {
    const response = await searchTwinClassFreezes({ search });
    return response.data;
  }

  function renderItem({ name, key }: TwinClassFreeze) {
    return isPopulatedString(name) ? `${name} : ${key}` : `N/A | ${key}`;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
