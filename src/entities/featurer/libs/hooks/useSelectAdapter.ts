import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  Featurer_DETAILED,
  useFeaturerSearch,
  useFetchFeaturerById,
} from "../../api";
import { FeaturerTypeId } from "../types";

export function useFeaturerSelectAdapter(
  typeId: FeaturerTypeId
): SelectAdapter<Featurer_DETAILED> {
  const { searchFeaturers } = useFeaturerSearch();
  const { fetchFeaturerById } = useFetchFeaturerById();

  async function getById(id: string) {
    const numId = typeof id === "string" ? parseInt(id, 10) : id;
    return await fetchFeaturerById(numId);
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const { data } = await searchFeaturers({
      pagination,
      filters: {
        typeIdList: [typeId],
        nameLikeList: [search ? wrapWithPercent(search) : "%"],
      },
    });

    return (data as Featurer_DETAILED[]) ?? [];
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ id, name }: Featurer_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${id}` : `${id}`;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
