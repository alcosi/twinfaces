import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { LinkFilterKeys, LinkFilters } from "../../api";
import {
  useLinkStrengthSelectAdapter,
  useLinkTypeSelectAdapter,
} from "./use-select-adapter";

export function useLinkFilters(): FilterFeature<LinkFilterKeys, LinkFilters> {
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const ltSelectAdapter = useLinkTypeSelectAdapter();
  const lsSelectAdapter = useLinkStrengthSelectAdapter();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  function buildFilterFields(): Record<LinkFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      forwardNameLikeList: {
        type: AutoFormValueType.tag,
        label: "Forward name",
      },
      backwardNameLikeList: {
        type: AutoFormValueType.tag,
        label: "Backward name",
      },
      srcTwinClassIdList: {
        type: AutoFormValueType.complexCombobox,
        label: "Source Twin Class",
        adapter: twinClassAdapter,
        extraFilters: buildTwinClassFilters(),
        mapExtraFilters: (filters) => mapTwinClassFilters(filters),
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
        multi: true,
      },
      dstTwinClassIdList: {
        type: AutoFormValueType.complexCombobox,
        label: "Destination Twin Class",
        adapter: twinClassAdapter,
        extraFilters: buildTwinClassFilters(),
        mapExtraFilters: (filters) => mapTwinClassFilters(filters),
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
        multi: true,
      },
      typeLikeList: {
        type: AutoFormValueType.combobox,
        label: "Type",
        multi: true,
        ...ltSelectAdapter,
      },
      strengthLikeList: {
        type: AutoFormValueType.combobox,
        label: "Strength",
        multi: true,
        ...lsSelectAdapter,
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<LinkFilterKeys, unknown>
  ): LinkFilters {
    return {
      idList: toArrayOfString(filters.idList),
      forwardNameLikeList: toArrayOfString(
        toArray(filters.forwardNameLikeList),
        "name"
      ).map(wrapWithPercent),
      backwardNameLikeList: toArrayOfString(
        toArray(filters.backwardNameLikeList),
        "backwardName"
      ).map(wrapWithPercent),
      srcTwinClassIdList: toArrayOfString(filters.srcTwinClassIdList, "id"),
      dstTwinClassIdList: toArrayOfString(filters.dstTwinClassIdList, "id"),
      typeLikeList: toArrayOfString(filters.typeLikeList, "id") as (
        | "ManyToOne"
        | "ManyToMany"
        | "OneToOne"
      )[],
      strengthLikeList: toArrayOfString(filters.strengthLikeList, "id") as (
        | "MANDATORY"
        | "OPTIONAL"
        | "OPTIONAL_BUT_DELETE_CASCADE"
      )[],
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
