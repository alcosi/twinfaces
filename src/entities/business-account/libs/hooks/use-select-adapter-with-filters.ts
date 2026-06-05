import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  BusinessAccount,
  DomainBusinessAccountFilters,
  DomainBusinessAccountSearchRq,
  useBusinessAccountSearch,
} from "../../api";

export function useBusinessAccountSelectAdapterWithFilters(): SelectAdapterWithFilters<
  BusinessAccount,
  DomainBusinessAccountFilters
> {
  const { searchBusinessAccount } = useBusinessAccountSearch();

  const filtersRef = useRef<DomainBusinessAccountFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: DomainBusinessAccountFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const { data } = await searchBusinessAccount({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: { businessAccountIdList: [id] },
    });
    return data?.[0]?.businessAccount;
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const { data } = await searchBusinessAccount({
      pagination,
      filters: {
        ...filtersRef.current,
        businessAccountNameLikeList: search ? [wrapWithPercent(search)] : [],
      } as DomainBusinessAccountSearchRq,
    });

    return data?.map((item) => item.businessAccount) ?? [];
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ id, name }: BusinessAccount) {
    return isPopulatedString(name) ? name : isPopulatedString(id) ? id : "N/A";
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
