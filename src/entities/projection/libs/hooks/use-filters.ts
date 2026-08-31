import z from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFeaturerFilters,
  useFeaturerSelectAdapterWithFilters,
} from "@/entities/featurer";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { ProjectionFilterKeys, ProjectionFilters } from "../../api";
import { useProjectionTypeSelectAdapter } from "./use-projection-type-select-adapter";

export function useProjectionFilters({
  enabledFilters,
}: {
  enabledFilters?: ProjectionFilterKeys[];
}): FilterFeature<ProjectionFilterKeys, ProjectionFilters> {
  const featurerAdapter = useFeaturerSelectAdapterWithFilters(44);
  const projectionTypeAdapter = useProjectionTypeSelectAdapter();

  const {
    buildFilterFields: buildTwinClassFieldFilters,
    mapFiltersToPayload: mapTwinClassFieldFilters,
  } = useTwinClassFieldFilters({});

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const {
    buildFilterFields: buildFeaturerFilters,
    mapFiltersToPayload: mapFeaturerFilters,
  } = useFeaturerFilters();

  const twinClassFieldAdapter = useTwinClassFieldSelectAdapterWithFilters();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();

  const allFilters: Record<ProjectionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    projectionTypeIdList: {
      type: AutoFormValueType.combobox,
      label: "Type",
      multi: true,
      ...projectionTypeAdapter,
    },
    dstTwinClassIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Dst twin class",
      adapter: twinClassAdapter,
      extraFilters: buildTwinClassFilters(),
      mapExtraFilters: (filters) => mapTwinClassFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    fieldProjectorIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Projector",
      adapter: featurerAdapter,
      extraFilters: buildFeaturerFilters(),
      mapExtraFilters: (filters) => mapFeaturerFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    srcTwinClassFieldIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Src twin class field",
      adapter: twinClassFieldAdapter,
      extraFilters: buildTwinClassFieldFilters(),
      mapExtraFilters: (filters) => mapTwinClassFieldFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    dstTwinClassFieldIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Dst twin class field",
      adapter: twinClassFieldAdapter,
      extraFilters: buildTwinClassFieldFilters(),
      mapExtraFilters: (filters) => mapTwinClassFieldFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
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
      projectionTypeIdList: toArrayOfString(filters.projectionTypeIdList, "id"),
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

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
