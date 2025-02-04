import { isPopulatedString, SelectAdapter } from "@/shared/libs";
import { DataList, useDatalistSearchV1 } from "../../api";

export function useDatalistSelectAdapter(): SelectAdapter<DataList> {
  const { searchDatalist } = useDatalistSearchV1();
  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as DataList;
  }

  async function getItems(search: string) {
    const response = await searchDatalist({ search });
    return response.data as DataList[];
  }

  function renderItem({ key, name }: DataList) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
