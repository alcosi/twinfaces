import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  DataListOptionFilters,
  DataListOptionV1,
  useDatalistOptionSearch,
} from "../../api";

export function useDatalistOptionSelectAdapterWithFilters(): SelectAdapterWithFilters<
  DataListOptionV1,
  DataListOptionFilters
> {
  const { searchDatalistOptions } = useDatalistOptionSearch();

  const filtersRef = useRef<DataListOptionFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: DataListOptionFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const response = await searchDatalistOptions({
      filters: { idList: [id] },
    });
    return response.data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const optionI18nLikeList = [
      ...(isPopulatedString(search) ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.optionI18nLikeList ?? []),
    ];

    const response = await searchDatalistOptions({
      pagination,
      filters: {
        ...filtersRef.current,
        optionI18nLikeList: optionI18nLikeList.length
          ? optionI18nLikeList
          : undefined,
      },
    });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem(item: DataListOptionV1 | string) {
    return isPopulatedString(item) ? item : item.name;
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
