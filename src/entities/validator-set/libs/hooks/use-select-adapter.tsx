import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import { ValidatorSet_DETAILED, useValidatorSetSearch } from "../../api";

export function useValidatorSetSelectAdapter(): SelectAdapter<ValidatorSet_DETAILED> {
  const { searchValidatorSets } = useValidatorSetSearch();

  async function getById(id: string) {
    const { data } = await searchValidatorSets({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: {
        idList: [id],
      },
    });
    return data?.[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const { data } = await searchValidatorSets({
      pagination,
      filters: {
        nameLikeList: search ? [wrapWithPercent(search)] : [],
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
  };
}
