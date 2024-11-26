import { SelectAdapter } from "@/shared/libs";
import { Twin_DETAILED } from "../../api";
import { useTwinFetchByIdV2, useTwinSearchV3 } from "../../api/hooks";

export function useTwinSelectAdapter(): SelectAdapter<Twin_DETAILED> {
  const { searchTwins } = useTwinSearchV3();
  const { fetchTwinById } = useTwinFetchByIdV2();

  async function getById(id: string) {
    const data = await fetchTwinById(id);
    return data as Twin_DETAILED;
  }

  async function getItems(search: string) {
    const response = await searchTwins({ search });
    return response.data as Twin_DETAILED[];
  }

  function getItemKey(item: Twin_DETAILED) {
    return item.id;
  }

  function getItemLabel({ name }: Twin_DETAILED) {
    return name;
  }

  return {
    getById,
    getItems,
    getItemKey,
    getItemLabel,
  };
}
