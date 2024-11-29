import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { type FilterFeature } from "@/shared/libs";
import { z } from "zod";
import { TwinClassFieldFilterKeys, TwinclassfieldFilters } from "../../api";
import { useTwinClassFieldSelectAdapter } from "./useSelectAdapter";

export function useTwinClassFieldFilters(): FilterFeature<
  TwinClassFieldFilterKeys,
  TwinclassfieldFilters
> {
  const { getById, getItems, getItemKey, getItemLabel } =
    useTwinClassFieldSelectAdapter();

  function buildFilterFields(): Record<
    TwinClassFieldFilterKeys,
    AutoFormValueInfo
  > {
    return {
      twinClassFieldList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<TwinClassFieldFilterKeys, unknown>
  ): TwinclassfieldFilters {
    const result: TwinclassfieldFilters = {
      // TODO: add logic here
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
