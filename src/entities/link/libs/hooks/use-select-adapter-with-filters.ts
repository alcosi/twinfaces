import { useRef, useState } from "react";

import { SelectAdapterWithFilters } from "@/shared/libs";

import {
  LinkFilters,
  Link_MANAGED,
  useLinkFetchById,
  useLinkSearch,
} from "../../api";

export function useLinkSelectAdapterWithFilters(): SelectAdapterWithFilters<
  Link_MANAGED,
  LinkFilters
> {
  const { searchLinks } = useLinkSearch();
  const { fetchLinkById } = useLinkFetchById();

  const filtersRef = useRef<LinkFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: LinkFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return fetchLinkById({
      linkId: id,
      query: {
        showLinkMode: "MANAGED",
      },
    });
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchLinks({
      search,
      pagination,
      filters: filtersRef.current,
    });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ srcTwinClass, dstTwinClass, name }: Link_MANAGED) {
    return `${srcTwinClass?.name} -> ${dstTwinClass?.name} : ${name}`;
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
