import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useDatalistOptionSelectAdapter } from "@/entities/datalist-option";
import {
  OptionProjectionFilterKeys,
  OptionProjectionFilters,
} from "@/entities/option-projection";
import { useProjectionTypeSelectAdapter } from "@/entities/projection/libs";
import { useUserSelectAdapter } from "@/entities/user";
import { DataTimeRangeV1 } from "@/shared/api";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

export function useOptionProjectionFilters({
  enabledFilters,
}: {
  enabledFilters?: OptionProjectionFilterKeys[];
}): FilterFeature<OptionProjectionFilterKeys, OptionProjectionFilters> {
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();
  const dataListOptionAdapter = useDatalistOptionSelectAdapter();
  const savedByUserAdapter = useUserSelectAdapter();

  const allFilters: Record<OptionProjectionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    projectionTypeIdList: {
      type: AutoFormValueType.combobox,
      label: "Type",
      multi: true,
      ...projectionTypeAdapter,
    },
    dstDataListOptionIdList: {
      type: AutoFormValueType.combobox,
      label: "Dst option",
      multi: true,
      ...dataListOptionAdapter,
    },
    srcDataListOptionIdList: {
      type: AutoFormValueType.combobox,
      label: "Src option",
      multi: true,
      ...dataListOptionAdapter,
    },
    savedByUserIdList: {
      type: AutoFormValueType.combobox,
      label: "Saved by user",
      multi: true,
      ...savedByUserAdapter,
    },
    changedAtFrom: {
      type: AutoFormValueType.string,
      label: "Change from",
      input_props: { type: "date" },
    },
    changedAtTo: {
      type: AutoFormValueType.string,
      label: "Change to",
      input_props: { type: "date" },
    },
  };
  function buildFilterFields(): Record<
    OptionProjectionFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<OptionProjectionFilterKeys, unknown>
  ): OptionProjectionFilters {
    const result: OptionProjectionFilters & { changedAt: DataTimeRangeV1 } = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      projectionTypeIdList: toArrayOfString(
        toArray(filters.projectionTypeIdList),
        "id"
      ),
      dstDataListOptionIdList: toArrayOfString(
        toArray(filters.dstDataListOptionIdList),
        "id"
      ),
      srcDataListOptionIdList: toArrayOfString(
        toArray(filters.srcDataListOptionIdList),
        "id"
      ),
      savedByUserIdList: toArrayOfString(
        toArray(filters.savedByUserIdList),
        "userId"
      ),
      changedAt: {
        from: filters.changedAtFrom ? `${filters.changedAtFrom}T00:00:00` : "",
        to: filters.changedAtTo ? `${filters.changedAtTo}T00:00:00` : "",
      },
    };
    return result;
  }
  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
