import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  usePermissionFilters,
  usePermissionSelectAdapterWithFilters,
} from "@/entities/permission";
import {
  useTwinFilters,
  useTwinSelectAdapterWithFilters,
} from "@/entities/twin";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import {
  useTransitionSelectAdapterWithFilters,
  useTwinFlowTransitionFilters,
} from "@/entities/twin-flow-transition";
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
  wrapWithPercent,
} from "@/shared/libs";

import { AttachmentFilterKeys, AttachmentFilters } from "../types";

export function useAttachmentFilters({
  enabledFilters,
}: {
  enabledFilters?: AttachmentFilterKeys[];
}): FilterFeature<AttachmentFilterKeys, AttachmentFilters> {
  const twinAdapter = useTwinSelectAdapterWithFilters();
  const transitionAdapter = useTransitionSelectAdapterWithFilters();
  const userAdapter = useUserSelectAdapterWithFilters();
  const permissionAdapter = usePermissionSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFieldFilters,
    mapFiltersToPayload: mapTwinClassFieldFilters,
  } = useTwinClassFieldFilters({});
  const {
    buildFilterFields: buildTwinFilters,
    mapFiltersToPayload: mapTwinFilters,
  } = useTwinFilters({});
  const {
    buildFilterFields: buildTransitionFilters,
    mapFiltersToPayload: mapTransitionFilters,
  } = useTwinFlowTransitionFilters({});
  const {
    buildFilterFields: buildUserFilters,
    mapFiltersToPayload: mapUserFilters,
  } = useUserFilters();
  const {
    buildFilterFields: buildPermissionFilters,
    mapFiltersToPayload: mapPermissionFilters,
  } = usePermissionFilters();

  const twinClassFieldAdapter = useTwinClassFieldSelectAdapterWithFilters();

  const allFilters: Record<AttachmentFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin",
      adapter: twinAdapter,
      extraFilters: buildTwinFilters(),
      mapExtraFilters: (filters) => mapTwinFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    externalIdLikeList: {
      type: AutoFormValueType.tag,
      label: "External Id",
    },
    twinflowTransitionIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Transition",
      adapter: transitionAdapter,
      extraFilters: buildTransitionFilters(),
      mapExtraFilters: (filters) => mapTransitionFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    storageLinkLikeList: {
      type: AutoFormValueType.tag,
      label: "Link",
    },
    createdByUserIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Author",
      adapter: userAdapter,
      extraFilters: buildUserFilters(),
      mapExtraFilters: (filters) => mapUserFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    titleLikeList: {
      type: AutoFormValueType.tag,
      label: "Title",
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
    viewPermissionIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "View permission",
      adapter: permissionAdapter,
      extraFilters: buildPermissionFilters(),
      mapExtraFilters: (filters) => mapPermissionFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    twinClassFieldIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Field",
      adapter: twinClassFieldAdapter,
      extraFilters: buildTwinClassFieldFilters(),
      mapExtraFilters: (filters) => mapTwinClassFieldFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    createdAt: {
      type: AutoFormValueType.dateRange,
      label: "Created",
    },
  };

  function buildFilterFields(): Record<
    AttachmentFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<AttachmentFilterKeys, unknown>
  ): AttachmentFilters {
    const createdAt = filters.createdAt as { from?: string; to?: string };
    const result: AttachmentFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      twinIdList: toArrayOfString(toArray(filters.twinIdList), "id"),
      externalIdLikeList: toArrayOfString(
        toArray(filters.externalIdLikeList),
        "id"
      ).map(wrapWithPercent),
      twinflowTransitionIdList: toArrayOfString(
        toArray(filters.twinflowTransitionIdList),
        "id"
      ),
      storageLinkLikeList: toArrayOfString(
        toArray(filters.storageLinkLikeList),
        "id"
      ).map(wrapWithPercent),
      createdByUserIdList: toArrayOfString(
        toArray(filters.createdByUserIdList),
        "userId"
      ),
      titleLikeList: toArrayOfString(toArray(filters.titleLikeList), "id").map(
        wrapWithPercent
      ),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
      viewPermissionIdList: toArrayOfString(
        toArray(filters.viewPermissionIdList),
        "id"
      ),
      twinClassFieldIdList: toArrayOfString(
        toArray(filters.twinClassFieldIdList),
        "id"
      ),
      createdAt: {
        from: createdAt?.from ? `${createdAt.from}T00:00:00` : "",
        to: createdAt?.to ? `${createdAt.to}T00:00:00` : "",
      },
    };
    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
