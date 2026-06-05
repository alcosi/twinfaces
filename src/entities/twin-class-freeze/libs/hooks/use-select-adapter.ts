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

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTwinClassFreezes({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name, key }: TwinClassFreeze) {
    return isPopulatedString(name) ? `${name} : ${key}` : `N/A | ${key}`;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
