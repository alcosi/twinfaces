import { useRef, useState } from "react";

import { SelectAdapterWithFilters, isPopulatedString } from "@/shared/libs";

import {
  TwinClass_DETAILED,
  useFetchTwinClassById,
  useTwinClassSearch,
} from "../../api";

export function useTwinClassSelectAdapterWithFilters(
  params?: {
    baseTwinClassId?: string;
  },
  abstract?: boolean
): SelectAdapterWithFilters<TwinClass_DETAILED, any> {
  const { searchByFilters } = useTwinClassSearch();
  const { fetchTwinClassById } = useFetchTwinClassById();

  const filtersRef = useRef<any>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: any) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return await fetchTwinClassById({ id });
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const baseFilters = abstract
      ? {
          abstractt: "ONLY_NOT",
          extendsHierarchyChildsForTwinClassSearch: params?.baseTwinClassId
            ? {
                idList: [params.baseTwinClassId],
                depth: 0,
              }
            : undefined,
        }
      : {};

    const res = await searchByFilters({
      search,
      pagination,
      filters: {
        ...baseFilters,
        ...filtersRef.current,
      },
    });

    return res.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ key = "", name }: TwinClass_DETAILED) {
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
