import { isPopulatedString, SelectAdapter } from "@/shared/libs";
import { DataList, useDatalistSearchV1, useFetchDatalistById } from "../../api";

export function useDatalistSelectAdapter(): SelectAdapter<DataList> {
  const { searchDatalist } = useDatalistSearchV1();
  const { fetchDatalistById } = useFetchDatalistById();

  async function getById(id: string) {
    const response = fetchDatalistById({
      dataListId: id,
      query: {
        showDataListMode: "MANAGED",
      },
    });

    return response;
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
