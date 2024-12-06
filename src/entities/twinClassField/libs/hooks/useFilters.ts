import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { type FilterFeature } from "@/shared/libs";
import { z } from "zod";
import { TwinClassFieldFilterKeys, TwinClassFieldFilters } from "../../api";
import { useTwinClassFieldSelectAdapter } from "./useSelectAdapter";

export function useTwinClassFieldFilters(): FilterFeature<
  TwinClassFieldFilterKeys,
  TwinClassFieldFilters
> {
  const { getById, getItems, renderItem } = useTwinClassFieldSelectAdapter();

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
  ): TwinClassFieldFilters {
    const result: TwinClassFieldFilters = {
      // TODO: add logic here
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
