import { SelectAdapter, isPopulatedString, isUndefined } from "@/shared/libs";

import { TransitionAliasV1, useTransitionAliasSearch } from "../../api";

export function useTransitionAliasSelectAdapter(): SelectAdapter<TransitionAliasV1> {
  const { searchTransitionAlias } = useTransitionAliasSearch();

  async function getById(id: string) {
    return { id };
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTransitionAlias({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem(value: TransitionAliasV1) {
    if (isPopulatedString(value)) return value;

    const { alias, usagesCount } = value;
    return isUndefined(usagesCount) ? alias : `${alias} | ${usagesCount}`;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
