import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { FeaturerTypes, useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  useValidatorSetFilters,
  useValidatorSetSelectAdapterWithFilters,
} from "@/entities/validator-set";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { TwinValidatorFilterKeys, TwinValidatorFilters } from "../../api";

export function useTwinValidatorFilters({
  enabledFilters,
}: {
  enabledFilters?: TwinValidatorFilterKeys[];
} = {}): FilterFeature<TwinValidatorFilterKeys, TwinValidatorFilters> {
  const validatorSetAdapter = useValidatorSetSelectAdapterWithFilters();
  const featurerAdapter = useFeaturerSelectAdapter(FeaturerTypes.validator);

  const {
    buildFilterFields: buildValidatorSetFilters,
    mapFiltersToPayload: mapValidatorSetFilters,
  } = useValidatorSetFilters();

  const allFilters: Record<TwinValidatorFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinValidatorSetIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Validator set",
      adapter: validatorSetAdapter,
      extraFilters: buildValidatorSetFilters(),
      mapExtraFilters: (filters) => mapValidatorSetFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    validatorFeaturerIdList: {
      type: AutoFormValueType.combobox,
      label: "Featurer",
      multi: true,
      ...featurerAdapter,
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
    invert: {
      type: AutoFormValueType.boolean,
      label: "Invert",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    active: {
      type: AutoFormValueType.boolean,
      label: "Active",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
  };

  function buildFilterFields(): Record<
    TwinValidatorFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinValidatorFilterKeys, unknown>
  ): TwinValidatorFilters {
    return {
      idList: toArrayOfString(filters.idList),
      twinValidatorSetIdList: toArrayOfString(
        filters.twinValidatorSetIdList,
        "id"
      ),
      validatorFeaturerIdList: toArrayOfString(
        filters.validatorFeaturerIdList,
        "id"
      ).map(Number),
      descriptionLikeList: toArrayOfString(filters.descriptionLikeList).map(
        wrapWithPercent
      ),
      invert: mapToChoice(filters.invert),
      active: mapToChoice(filters.active),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
