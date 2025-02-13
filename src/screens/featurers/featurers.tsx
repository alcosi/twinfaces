"use client";

import { useFeaturerFilters, useFeaturersSearch } from "@/entities/featurer";
import { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";
import { FeaturerTypeTable } from "./tables";
import { FiltersState } from "@/widgets/crud-data-table";

interface IFeaturerType {
  title: string;
  typeIdList: number[];
}

const FEATURER_TYPES: IFeaturerType[] = [
  { title: "Field Typer", typeIdList: [13] },
  { title: "Trigger", typeIdList: [15] },
  { title: "Validator", typeIdList: [16] },
  { title: "Head Hunter", typeIdList: [26] },
  { title: "Filler", typeIdList: [23] },
];

export function FeaturersScreen() {
  const { searchFeaturers } = useFeaturersSearch();
  const { mapFiltersToPayload } = useFeaturerFilters();

  function createFetcher(typeIdList: number[]) {
    return async function fetchFeaturers(
      pagination: PaginationState,
      options: FiltersState
    ) {
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
