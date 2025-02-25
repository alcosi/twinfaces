import { isPopulatedString, SelectAdapter } from "@/shared/libs";
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

  function renderItem({ alias, usagesCount }: TransitionAliasV1) {
    return isPopulatedString(alias) && `${alias} | ${usagesCount}`;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
