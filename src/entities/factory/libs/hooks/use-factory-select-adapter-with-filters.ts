import { useRef, useState } from "react";

import {
  Factory,
  FactoryFilters,
  useFactorySearch,
  useFetchFactoryById,
} from "@/entities/factory";
import {
  SelectAdapterWithFilters,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

export function useFactorySelectAdapterWithFilters(): SelectAdapterWithFilters<
  Factory,
  FactoryFilters
> {
  const { searchFactories } = useFactorySearch();
  const { fetchFactoryById } = useFetchFactoryById();

  const filtersRef = useRef<FactoryFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: FactoryFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return await fetchFactoryById(id);
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const keyLikeList = [
      ...(search ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.keyLikeList ?? []),
    ];

    const response = await searchFactories({
      pagination,
      filters: {
        ...filtersRef.current,
        keyLikeList,
      },
    });

    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ key = "", name }: Factory) {
    return isPopulatedString(name) ? name : key;
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
