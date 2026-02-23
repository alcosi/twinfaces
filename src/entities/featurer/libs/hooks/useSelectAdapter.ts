import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import { Featurer_DETAILED, useFeaturerSearch } from "../../api";
import { useFeaturerFetchById } from "../../api/hooks/use-fetch-by-id";
import { FeaturerTypeId } from "../types";

export function useFeaturerSelectAdapter(
  typeId: FeaturerTypeId
): SelectAdapter<Featurer_DETAILED> {
  const { searchFeaturers } = useFeaturerSearch();
  const { fetchFeaturerById } = useFeaturerFetchById();

  async function getById(id: string) {
    const numId = typeof id === "string" ? parseInt(id, 10) : id;
    return await fetchFeaturerById(numId);
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
