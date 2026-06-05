import { useRef, useState } from "react";

import { SelectAdapterWithFilters, isPopulatedString } from "@/shared/libs";

import {
  PermissionFilters,
  Permission_DETAILED,
  usePermissionSearchV1,
} from "../../api";

export function usePermissionSelectAdapterWithFilters(): SelectAdapterWithFilters<
  Permission_DETAILED,
  PermissionFilters
> {
  const { searchPermissions } = usePermissionSearchV1();

  const filtersRef = useRef<PermissionFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: PermissionFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const response = await searchPermissions({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: { idList: [id] },
    });
    return response.data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchPermissions({
      search,
      pagination,
      filters: filtersRef.current,
    });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name, key }: Permission_DETAILED) {
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
