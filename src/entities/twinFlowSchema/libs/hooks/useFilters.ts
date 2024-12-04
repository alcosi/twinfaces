import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  TwinFlowSchemaFilterKeys,
  TwinFlowSchemaFilters,
  useTwinFlowSchemaSelectAdapter,
} from "@/entities/twinFlowSchema";
import { type FilterFeature } from "@/shared/libs";
import { z } from "zod";

export function useTwinFlowSchemaFilters(): FilterFeature<
  TwinFlowSchemaFilterKeys,
  TwinFlowSchemaFilters
> {
  const { getById, getItems, renderItem } = useTwinFlowSchemaSelectAdapter();

  function buildFilterFields(): Record<
    TwinFlowSchemaFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<TwinFlowSchemaFilterKeys, unknown>
  ): TwinFlowSchemaFilters {
    const result: TwinFlowSchemaFilters = {
      // TODO: add logic here
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
