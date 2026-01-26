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

  const hasAdvancedFilters = Object.keys(filtersRef.current ?? {}).length > 0;

  async function getById(id: string) {
    return await fetchTwinClassById({ id });
  }

  async function getItems(search: string) {
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
      search: hasAdvancedFilters ? undefined : search,
      filters: {
        ...baseFilters,
        ...filtersRef.current,
      },
    });

    return res.data;
  }

  function renderItem({ key = "", name }: TwinClass_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    renderItem,
    setFilters,
    invalidate,
    version,
  };
}
