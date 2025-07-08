import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import { Featurer_DETAILED, useFeaturerSearch } from "../../api";
import { FeaturerTypeId } from "../types";

export function useFeaturerSelectAdapter(
  typeId: FeaturerTypeId
): SelectAdapter<Featurer_DETAILED> {
  const { searchFeaturers } = useFeaturerSearch();

  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as unknown as Featurer_DETAILED;
  }

  async function getItems(search: string) {
    const { data } = await searchFeaturers({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: {
        typeIdList: [typeId],
        nameLikeList: [search ? wrapWithPercent(search) : "%"],
      },
    });

    return (data as Featurer_DETAILED[]) ?? [];
  }

  function renderItem({ id, name }: Featurer_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${id}` : `${id}`;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
