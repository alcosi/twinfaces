import { z } from "zod";
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { FilterFeature, toArrayOfString } from "@/shared/libs";
import { FactoryBranchFilterKeys, FactoryBranchFilters } from "../../api";

export function useFactoryBrancheFilters(): FilterFeature<
  FactoryBranchFilterKeys,
  FactoryBranchFilters
> {
  function buildFilterFields(): Record<
    FactoryBranchFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryBranchFilterKeys, unknown>
  ): FactoryBranchFilters {
    return {
      idList: toArrayOfString(filters.idList),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
