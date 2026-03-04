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

  async function getItems(search: string) {
    const { data } = await searchValidatorSets({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: {
        nameLikeList: search ? [wrapWithPercent(search)] : [],
      },
    });

    return data ?? [];
  }

  function renderItem({ id, name }: ValidatorSet_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${id}` : id;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
