import z from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinClassFieldSelectAdapter } from "@/entities/twin-class-field";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { ProjectionFilterKeys, ProjectionFilters } from "../../api";

export function useProjectionFilters({
  enabledFilters,
}: {
  enabledFilters?: ProjectionFilterKeys[];
}): FilterFeature<ProjectionFilterKeys, ProjectionFilters> {
  const twinClassAdapter = useTwinClassSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(44);
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapter();

  const allFilters: Record<ProjectionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    dstTwinClassIdList: {
      type: AutoFormValueType.combobox,
      label: "Dst twin class",
      multi: true,
      ...twinClassAdapter,
    },
    fieldProjectorIdList: {
      type: AutoFormValueType.combobox,
      label: "Projector",
      multi: true,
      ...featurerAdapter,
    },
    srcTwinClassFieldIdList: {
      type: AutoFormValueType.combobox,
      label: "Src twin class field",
      multi: true,
      ...twinClassFieldAdapter,
    },
    dstTwinClassFieldIdList: {
      type: AutoFormValueType.combobox,
      label: "Dst twin class field",
      multi: true,
      ...twinClassFieldAdapter,
    },
  };

  function buildFilterFields(): Record<
    ProjectionFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<ProjectionFilterKeys, unknown>
  ): ProjectionFilters {
    return {
      idList: toArrayOfString(filters.idList),
      dstTwinClassIdList: toArrayOfString(filters.dstTwinClassIdList, "id"),
      fieldProjectorIdList: toArrayOfString(
        filters.fieldProjectorIdList,
        "id"
      ).map(Number),
      srcTwinClassFieldIdList: toArrayOfString(
        toArray(filters.srcTwinClassFieldIdList),
        "id"
      ),
      dstTwinClassFieldIdList: toArrayOfString(
        toArray(filters.dstTwinClassFieldIdList),
        "id"
      ),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
