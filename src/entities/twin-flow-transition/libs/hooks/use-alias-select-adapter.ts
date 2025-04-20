import { SelectAdapter, isPopulatedString, isUndefined } from "@/shared/libs";

import { TransitionAliasV1, useTransitionAliasSearch } from "../../api";

export function useTransitionAliasSelectAdapter(): SelectAdapter<TransitionAliasV1> {
  const { searchTransitionAlias } = useTransitionAliasSearch();

  async function getById(id: string) {
    return { id };
  }

  async function getItems(search: string) {
    const response = await searchTransitionAlias({ search });
    return response.data;
  }

  function renderItem(value: TransitionAliasV1) {
    if (isPopulatedString(value)) return value;

    const { alias, usagesCount } = value;
    return isUndefined(usagesCount) ? alias : `${alias} | ${usagesCount}`;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
