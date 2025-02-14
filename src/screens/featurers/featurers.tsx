"use client";

import {
  Featurer,
  FeaturerTypes,
  useFeaturerFilters,
  useFeaturersSearch,
} from "@/entities/featurer";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { FeaturerTypeTable } from "./tables";
import { FiltersState } from "@/widgets/crud-data-table";
import { PagedResponse } from "@/shared/api";

type FeaturerType = {
  title: string;
  typeIdList: number[];
};

const FEATURER_TYPES: FeaturerType[] = [
  { title: "Field Typer", typeIdList: [FeaturerTypes.fieldTyper] },
  { title: "Trigger", typeIdList: [FeaturerTypes.trigger] },
  { title: "Validator", typeIdList: [FeaturerTypes.validator] },
  { title: "Head Hunter", typeIdList: [FeaturerTypes.headHunter] },
  { title: "Filler", typeIdList: [FeaturerTypes.filler] },
];

export function FeaturersScreen() {
  const { searchFeaturers } = useFeaturersSearch();
  const { mapFiltersToPayload } = useFeaturerFilters();

  function createFetcher(typeIdList: number[]) {
    return async function fetchFeaturers(
      pagination: PaginationState,
      options: FiltersState
    ): Promise<PagedResponse<Featurer>> {
      const _filters = {
        ...mapFiltersToPayload(options.filters),
        typeIdList,
      };
      try {
        return await searchFeaturers({ pagination, options: _filters });
      } catch (error) {
        toast.error("An error occured while featurers: " + error);
        throw new Error("An error occured while featurers:" + error);
      }
    };
  }

  return (
    <>
      {FEATURER_TYPES.map(({ title, typeIdList }) => (
        <FeaturerTypeTable
          key={typeIdList[0]}
          title={title}
          fetcher={createFetcher(typeIdList)}
        />
      ))}
    </>
  );
}
