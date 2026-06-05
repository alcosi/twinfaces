import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  ValidatorSetFilters,
  ValidatorSet_DETAILED,
  useValidatorSetSearch,
} from "../../api";

export function useValidatorSetSelectAdapterWithFilters(): SelectAdapterWithFilters<
  ValidatorSet_DETAILED,
  ValidatorSetFilters
> {
  const { searchValidatorSets } = useValidatorSetSearch();

  const filtersRef = useRef<ValidatorSetFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: ValidatorSetFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const { data } = await searchValidatorSets({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: { idList: [id] },
    });
    return data?.[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const nameLikeList = [
      ...(search ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.nameLikeList ?? []),
    ];

    const { data } = await searchValidatorSets({
      pagination,
      filters: {
        ...filtersRef.current,
        nameLikeList,
      },
    });

    return data ?? [];
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ id, name }: ValidatorSet_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${id}` : id;
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
