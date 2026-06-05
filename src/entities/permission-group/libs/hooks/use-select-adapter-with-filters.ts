import { useRef, useState } from "react";

import { SelectAdapterWithFilters, isPopulatedString } from "@/shared/libs";

import {
  PermissionGroupFilters,
  PermissionGroup_DETAILED,
  useFetchPermissionGroupById,
  usePermissionGroupSearchV1,
} from "../../api";

export function usePermissionGroupSelectAdapterWithFilters(): SelectAdapterWithFilters<
  PermissionGroup_DETAILED,
  PermissionGroupFilters
> {
  const { fetchPermissionGroupById } = useFetchPermissionGroupById();
  const { searchPermissionGroups } = usePermissionGroupSearchV1();

  const filtersRef = useRef<PermissionGroupFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: PermissionGroupFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return await fetchPermissionGroupById({
      groupId: id,
      query: {
        showPermissionGroup2TwinClassMode: "DETAILED",
        showPermissionGroupMode: "DETAILED",
      },
    });
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchPermissionGroups({
      search,
      pagination,
      filters: filtersRef.current,
    });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name, key }: PermissionGroup_DETAILED) {
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
