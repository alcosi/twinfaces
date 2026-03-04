import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  ValidatorSetFilterKeys,
  ValidatorSetFilters,
} from "@/entities/validator-set";
import {
  FilterFeature,
  mapToChoice,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

export function useValidatorSetFilters(): FilterFeature<
  ValidatorSetFilterKeys,
  ValidatorSetFilters
> {
  function buildFilterFields(): Record<
    ValidatorSetFilterKeys,
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
    };
  }

  function mapFiltersToPayload(
    filters: Record<ValidatorSetFilterKeys, unknown>
  ): ValidatorSetFilters {
    return {
      idList: toArrayOfString(filters.idList),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      descriptionLikeList: toArrayOfString(filters.descriptionLikeList).map(
        wrapWithPercent
      ),
      invert: mapToChoice(filters.invert),
    };
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
