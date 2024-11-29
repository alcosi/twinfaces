import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { type FilterFeature } from "@/shared/libs";
import { z } from "zod";
import { TwinFlowFilterKeys, TwinFlowFilters } from "../../api";
import { useTwinFlowSelectAdapter } from "../../libs";

export function useTwinFlowFilters(): FilterFeature<
  TwinFlowFilterKeys,
  TwinFlowFilters
> {
  const { getById, getItems, getItemKey, getItemLabel } =
    useTwinFlowSelectAdapter();

  function buildFilterFields(): Record<TwinFlowFilterKeys, AutoFormValueInfo> {
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
    filters: Record<TwinFlowFilterKeys, unknown>
  ): TwinFlowFilters {
    const result: TwinFlowFilters = {
      // TODO: add logic here
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
