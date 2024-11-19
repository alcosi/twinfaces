import { SelectAdapter } from "@/shared/libs";
import { TwinStatus } from "../../api";
import { useFetchTwinStatusById } from "./useFetchById";
import { useTwinStatusSearchV1 } from "./useSearchV1";

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
      const { data } = await searchTwinStatuses({ twinClassId, search });
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
