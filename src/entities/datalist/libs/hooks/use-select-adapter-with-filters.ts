import { useRef, useState } from "react";

import { SelectAdapterWithFilters, isPopulatedString } from "@/shared/libs";

import {
  DataList,
  DatalistFilters,
  useDatalistSearchV1,
  useFetchDatalistById,
} from "../../api";

export function useDatalistSelectAdapterWithFilters(): SelectAdapterWithFilters<
  DataList,
  DatalistFilters
> {
  const { searchDatalist } = useDatalistSearchV1();
  const { fetchDatalistById } = useFetchDatalistById();

  const filtersRef = useRef<DatalistFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: DatalistFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return await fetchDatalistById({
      dataListId: id,
      query: {
        showDataListMode: "MANAGED",
      },
    });
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchDatalist({
      search,
      pagination,
      filters: filtersRef.current,
    });
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
    setFilters,
    invalidate,
    version,
  };
}
