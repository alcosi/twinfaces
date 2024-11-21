import { SelectAdapter, wrapWithPercent } from "@/shared/libs";
import {
  TwinStatus,
  TwinStatusFilters,
  useFetchTwinStatusById,
  useTwinStatusSearchV1,
} from "../../api";

export function useTwinStatusSelectAdapter(
  twinClassId?: string
): SelectAdapter<TwinStatus> {
  const { fetchTwinStatusById } = useFetchTwinStatusById();
  const { searchTwinStatuses } = useTwinStatusSearchV1();

  async function getById(id: string) {
    return fetchTwinStatusById(id);
  }

  async function getItems(search: string) {
    try {
      const filters: TwinStatusFilters = {
        twinClassIdList: twinClassId ? [twinClassId] : [],
        keyLikeList: search ? [wrapWithPercent(search)] : [],
      };
      const { data } = await searchTwinStatuses({ filters });
      return data;
    } catch (error) {
      console.error("Error fetching search items:", error);
      return [];
    }
  }

  function getItemKey(item: TwinStatus) {
    return item.id ?? "";
  }

  function getItemLabel({ key = "", name }: TwinStatus): string {
    return name ? `${key} (${name})` : key;
  }

  return {
    getById,
    getItems,
    getItemKey,
    getItemLabel,
  };
}
