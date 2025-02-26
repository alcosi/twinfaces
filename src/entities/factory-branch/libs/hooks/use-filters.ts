import { z } from "zod";
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  FilterFeature,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { FactoryBranchFilterKeys, FactoryBranchFilters } from "../../api";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { useFactorySelectAdapter } from "@/entities/factory/libs";

export function useFactoryBranchFilters(): FilterFeature<
  FactoryBranchFilterKeys,
  FactoryBranchFilters
> {
  const fAdapter = useFactorySelectAdapter();
  const fcsAdapter = useFactoryConditionSetSelectAdapter();

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
      factoryIdList: {
        type: AutoFormValueType.combobox,
        label: "Factory",
        multi: true,
        ...fAdapter,
      },
      factoryConditionSetIdList: {
        type: AutoFormValueType.combobox,
        label: "Condition set",
        multi: true,
        ...fcsAdapter,
      },
      conditionInvert: {
        type: AutoFormValueType.boolean,
        label: "Condition invert",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      active: {
        type: AutoFormValueType.boolean,
        label: "Active",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      nextFactoryIdList: {
        type: AutoFormValueType.combobox,
        label: "Next Factory",
        multi: true,
        ...fAdapter,
      },
      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryBranchFilterKeys, unknown>
  ): FactoryBranchFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      factoryConditionSetIdList: toArrayOfString(
        filters.factoryConditionSetIdList,
        "id"
      ),
      active: mapToChoice(filters.active),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
      nextFactoryIdList: toArrayOfString(filters.nextFactoryIdList, "id"),
      conditionInvert: mapToChoice(filters.conditionInvert),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
