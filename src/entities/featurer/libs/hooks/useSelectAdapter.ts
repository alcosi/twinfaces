import { ApiContext } from "@/shared/api";
import { SelectAdapter } from "@/shared/libs";
import { useContext } from "react";
import { Featurer_DETAILED } from "../../api";
import { FeaturerTypeId } from "../types";

export function useFeaturerSelectAdapter(
  typeId: FeaturerTypeId
): SelectAdapter<Featurer_DETAILED> {
  // TODO: Replace with useSearchHook
  const api = useContext(ApiContext);

  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as unknown as Featurer_DETAILED;
  }

  async function getItems(search: string) {
    const response = await api.featurer.search({
      pagination: { pageIndex: 0, pageSize: 10 },
      options: {
        typeIdList: [typeId],
        nameLikeList: [search ? "%" + search + "%" : "%"],
      },
    });

    const data: Featurer_DETAILED[] =
      (response.data?.featurerList as Featurer_DETAILED[]) ?? [];

    return data;
  }

  function renderItem({ id, name }: Featurer_DETAILED) {
    return `${id} (${name})`;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
