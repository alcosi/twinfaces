"use client";

import {
  Featurer,
  FeaturerTypes,
  useFeaturerFilters,
  useFeaturerSearch,
} from "@/entities/featurer";
import { PagedResponse } from "@/shared/api";
import { FiltersState } from "@/widgets/crud-data-table";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { FeaturerTypeTable } from "./tables";

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
  const { searchFeaturers } = useFeaturerSearch();
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
        return await searchFeaturers({ pagination, filters: _filters });
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
