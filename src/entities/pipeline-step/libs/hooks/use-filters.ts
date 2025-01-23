import { FilterFeature, toArrayOfString } from "@/shared/libs";
import { PipelineStepFilterKeys, PipelineStepFilters } from "../../api";
import { useFactorySelectAdapter } from "../../../factory";
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";

export function usePipelineStepFilters(): FilterFeature<
  PipelineStepFilterKeys,
  PipelineStepFilters
> {
  const factorySelectAdapter = useFactorySelectAdapter();

  function buildFilterFields(): Record<
    PipelineStepFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      factoryIdList: {
        type: AutoFormValueType.combobox,
        label: "Factory",
        multi: true,
        ...factorySelectAdapter,
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<PipelineStepFilterKeys, unknown>
  ): PipelineStepFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
