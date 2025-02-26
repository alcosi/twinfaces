import { FilterFeature, mapToChoice, toArray, toArrayOfString, wrapWithPercent } from "@/shared/libs";
import {
  FactoryMultiplierFilterKeys,
  FactoryMultiplierFilters,
} from "../../api";
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { useFactorySelectAdapter } from "@/entities/factory/libs";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useFeaturerSelectAdapter } from "@/entities/featurer";

export function useFactoryMultiplierFilters(): FilterFeature<
  FactoryMultiplierFilterKeys,
  FactoryMultiplierFilters
> {
  const fAdapter = useFactorySelectAdapter();
  const tcAdapter = useTwinClassSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(22);

  function buildFilterFields(): Record<
    FactoryMultiplierFilterKeys,
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
      inputTwinClassIdList: {
        type: AutoFormValueType.combobox,
        label: "Input class",
        multi: true,
        ...tcAdapter,
      },
      multiplierFeaturerIdList: {
        type: AutoFormValueType.combobox,
        label: "Muliplier featurer",
        multi: true,
        ...featurerAdapter,
      },
      active: {
        type: AutoFormValueType.boolean,
        label: "Active",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryMultiplierFilterKeys, unknown>
  ): FactoryMultiplierFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      inputTwinClassIdList: toArrayOfString(filters.inputTwinClassIdList, "id"),
      multiplierFeaturerIdList: toArrayOfString(filters.multiplierFeaturerIdList, "id").map(Number),
      active: mapToChoice(filters.active),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList), "description"
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
