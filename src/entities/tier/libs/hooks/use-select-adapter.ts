import {
  SelectAdapter,
  isPopulatedString,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { Tier_DETAILED, useTierSearch } from "../../api";

export function useTierSelectAdapter(): SelectAdapter<Tier_DETAILED> {
  const { searchTiers } = useTierSearch();

  async function getById(id: string) {
    const response = await searchTiers({
      filters: { idList: toArrayOfString(toArray(id)) },
    });
    return response.data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTiers({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name }: Tier_DETAILED) {
    return isPopulatedString(name) ? name : "N/A";
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
