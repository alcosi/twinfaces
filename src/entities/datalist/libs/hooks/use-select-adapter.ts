import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import { DataList, useDatalistSearchV1, useFetchDatalistById } from "../../api";

export function useDatalistSelectAdapter(): SelectAdapter<DataList> {
  const { searchDatalist } = useDatalistSearchV1();
  const { fetchDatalistById } = useFetchDatalistById();

  async function getById(id: string) {
    const datalist = await fetchDatalistById({
      dataListId: id,
      query: {
        showDataListMode: "MANAGED",
      },
    });

    return datalist;
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchDatalist({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ key, name }: DataList) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
