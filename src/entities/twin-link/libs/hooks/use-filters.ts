import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useLinkSelectAdapter } from "@/entities/link";
import {
  useTwinFilters,
  useTwinSelectAdapterWithFilters,
} from "@/entities/twin";
import {
  useUserFilters,
  useUserSelectAdapterWithFilters,
} from "@/entities/user";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { TwinLinkFilterKeys, TwinLinkFilters } from "../../api/types";

export function useTwinLinkFilters({
  enabledFilters,
}: {
  enabledFilters?: TwinLinkFilterKeys[];
} = {}): FilterFeature<TwinLinkFilterKeys, TwinLinkFilters> {
  const srcTwinAdapter = useTwinSelectAdapterWithFilters();
  const dstTwinAdapter = useTwinSelectAdapterWithFilters();
  const userAdapter = useUserSelectAdapterWithFilters();
  const linkAdapter = useLinkSelectAdapter();

  const {
    buildFilterFields: buildTwinFilters,
    mapFiltersToPayload: mapTwinFilters,
  } = useTwinFilters({});
  const {
    buildFilterFields: buildUserFilters,
    mapFiltersToPayload: mapUserFilters,
  } = useUserFilters();

  const allFilters: Record<TwinLinkFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    srcTwinIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Source twin",
      adapter: srcTwinAdapter,
      extraFilters: buildTwinFilters(),
      mapExtraFilters: (filters) => mapTwinFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    dstTwinIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Destination twin",
      adapter: dstTwinAdapter,
      extraFilters: buildTwinFilters(),
      mapExtraFilters: (filters) => mapTwinFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    linkIdList: {
      type: AutoFormValueType.combobox,
      label: "Link",
      multi: true,
      ...linkAdapter,
    },
    createdByUserIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Created by user",
      adapter: userAdapter,
      extraFilters: buildUserFilters(),
      mapExtraFilters: (filters) => mapUserFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    createdAt: {
      type: AutoFormValueType.dateRange,
      label: "Created",
    },
  };

  function buildFilterFields(): Record<TwinLinkFilterKeys, AutoFormValueInfo> {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinLinkFilterKeys, unknown>
  ): TwinLinkFilters {
    const createdAt = filters.createdAt as { from?: string; to?: string };

    return {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      srcTwinIdList: toArrayOfString(toArray(filters.srcTwinIdList), "id"),
      dstTwinIdList: toArrayOfString(toArray(filters.dstTwinIdList), "id"),
      linkIdList: toArrayOfString(toArray(filters.linkIdList), "id"),
      createdByUserIdList: toArrayOfString(
        toArray(filters.createdByUserIdList),
        "userId"
      ),
      createdAt: {
        from: createdAt?.from ? `${createdAt.from}T00:00:00` : "",
        to: createdAt?.to ? `${createdAt.to}T00:00:00` : "",
      },
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
