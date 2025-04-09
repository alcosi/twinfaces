import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { AttachmentFilterKeys, AttachmentFilters } from "@/entities/attachment";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useTwinSelectAdapter } from "@/entities/twin";
import { useTwinClassFieldSelectAdapter } from "@/entities/twin-class-field";
import { useTransitionSelectAdapter } from "@/entities/twin-flow-transition";
import { useUserSelectAdapter } from "@/entities/user";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

export function useAttachmentFilters({
  enabledFilters,
}: {
  enabledFilters?: AttachmentFilterKeys[];
}): FilterFeature<AttachmentFilterKeys, AttachmentFilters> {
  const twinAdapter = useTwinSelectAdapter();
  const transitionAdapter = useTransitionSelectAdapter();
  const userAdapter = useUserSelectAdapter();
  const permissionAdapter = usePermissionSelectAdapter();
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapter();

  const allFilters: Record<AttachmentFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin",
      multi: true,
      ...twinAdapter,
    },
    externalIdLikeList: {
      type: AutoFormValueType.tag,
      label: "External Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinflowTransitionIdList: {
      type: AutoFormValueType.combobox,
      label: "Transition",
      multi: true,
      ...transitionAdapter,
    },
    storageLinkLikeList: {
      type: AutoFormValueType.tag,
      label: "Link",
    },
    createdByUserIdList: {
      type: AutoFormValueType.combobox,
      label: "Author",
      multi: true,
      ...userAdapter,
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
      type: AutoFormValueType.combobox,
      label: "View permission",
      multi: true,
      ...permissionAdapter,
    },
    twinClassFieldIdList: {
      type: AutoFormValueType.combobox,
      label: "Field",
      multi: true,
      ...twinClassFieldAdapter,
    },
    createdAt: {
      type: AutoFormValueType.calendar,
      label: "Created at",
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
        from: filters.createdAt
          ? new Date((filters.createdAt as { from?: Date | string }).from || "")
              .toISOString()
              .slice(0, 19)
          : "",

        to: filters.createdAt
          ? new Date((filters.createdAt as { to?: Date | string }).to || "")
              .toISOString()
              .slice(0, 19)
          : "",
      },
    };
    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
