import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { SpaceRoleFilter, SpaceRoleFilterKeys } from "../../api";

export function useSpaceRoleFilters({
  enabledFilters,
}: {
  enabledFilters?: SpaceRoleFilterKeys[];
} = {}): FilterFeature<SpaceRoleFilterKeys, SpaceRoleFilter> {
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const allFilters: Record<SpaceRoleFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    keyLikeList: {
      type: AutoFormValueType.tag,
      label: "Key",
      placeholder: "Search by key...",
    },
    twinClassIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin class",
      adapter: twinClassAdapter,
      extraFilters: buildTwinClassFilters(),
      mapExtraFilters: (filters) => mapTwinClassFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    // todo change when it will be unlocked https://alcosi.atlassian.net/browse/TWINFACES-835
    businessAccountIdList: {
      type: AutoFormValueType.tag,
      label: "Business account",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    nameI18nLikeList: {
      type: AutoFormValueType.tag,
      label: "Name",
      placeholder: "Search by name...",
    },
    descriptionI18nLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
      placeholder: "Search by description...",
    },
  };

  function buildFilterFields(): Record<SpaceRoleFilterKeys, AutoFormValueInfo> {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<SpaceRoleFilterKeys, unknown>
  ): SpaceRoleFilter {
    return {
      idList: toArrayOfString(filters.idList),
      keyLikeList: toArrayOfString(filters.keyLikeList).map(wrapWithPercent),
      twinClassIdList: toArrayOfString(filters.twinClassIdList, "id"),
      businessAccountIdList: toArrayOfString(filters.businessAccountIdList),
      nameI18nLikeList: toArrayOfString(filters.nameI18nLikeList).map(
        wrapWithPercent
      ),
      descriptionI18nLikeList: toArrayOfString(
        filters.descriptionI18nLikeList
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
