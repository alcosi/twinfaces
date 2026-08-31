import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedArray,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FeaturerFilters,
  Featurer_DETAILED,
  useFeaturerSearch,
} from "../../api";
import { FeaturerTypeId } from "../types";
import { useFeaturerSelectAdapter } from "./useSelectAdapter";

/**
 * Featurer picker for a `complexCombobox` field: the advanced-filters panel
 * feeds its values in through `setFilters`, and the list reloads on
 * `invalidate`. The picker stays pinned to `typeId` — the panel only narrows
 * within that type.
 */
export function useFeaturerSelectAdapterWithFilters(
  typeId: FeaturerTypeId
): SelectAdapterWithFilters<Featurer_DETAILED, FeaturerFilters> {
  const { getById, renderItem } = useFeaturerSelectAdapter(typeId);
  const { searchFeaturers } = useFeaturerSearch();

  const filtersRef = useRef<FeaturerFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: FeaturerFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const { nameLikeList, ...filters } = filtersRef.current;

    const { data } = await searchFeaturers({
      pagination,
      filters: {
        ...filters,
        // The query typed into the combobox wins over the panel's "Name"
        // filter; "%" keeps the list unfiltered when neither is set.
        nameLikeList: isPopulatedString(search)
          ? [wrapWithPercent(search)]
          : isPopulatedArray(nameLikeList)
            ? nameLikeList
            : ["%"],
        typeIdList: [typeId],
      },
    });

    return (data as Featurer_DETAILED[]) ?? [];
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
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
