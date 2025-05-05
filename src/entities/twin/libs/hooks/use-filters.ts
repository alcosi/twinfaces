import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { usePermissionSelectAdapter } from "@/entities/permission";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinClassFieldSelectAdapter } from "@/entities/twin-class-field";
import { useTransitionSelectAdapter } from "@/entities/twin-flow-transition";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import {
  AttachmentFilterKeys,
  AttachmentFilters,
  DataTimeRangeV1,
  TwinFilterKeys,
  TwinFilters,
} from "@/entities/twin/server";
import { useUserSelectAdapter } from "@/entities/user";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  isUndefined,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { useTwinSelectAdapter } from "./use-select-adapter";

export function useTwinFilters(
  baseTwinClassId?: string
): FilterFeature<TwinFilterKeys, TwinFilters> {
  const tcAdapter = useTwinClassSelectAdapter();
  const sAdapter = useTwinStatusSelectAdapter();
  const uAdapter = useUserSelectAdapter();
  const tAdapter = useTwinSelectAdapter();

  function buildFilterFields(): Partial<
    Record<TwinFilterKeys, AutoFormValueInfo>
  > {
    return {
      twinIdList: {
        type: AutoFormValueType.tag,
        label: "ID",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      twinClassIdList: isUndefined(baseTwinClassId)
        ? {
            type: AutoFormValueType.combobox,
            label: "Twin Class",
            multi: true,
            ...tcAdapter,
          }
        : undefined,
      statusIdList: {
        type: AutoFormValueType.combobox,
        label: "Statuses",
        multi: true,
        ...sAdapter,
      },
      twinNameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.string,
        label: "Description",
      },
      headTwinIdList: {
        type: AutoFormValueType.combobox,
        label: "Head",
        multi: true,
        ...tAdapter,
      },
      createdByUserIdList: {
        type: AutoFormValueType.combobox,
        label: "Author",
        multi: true,
        ...uAdapter,
      },
      assignerUserIdList: {
        type: AutoFormValueType.combobox,
        label: "Assignee",
        multi: true,
        ...uAdapter,
      },
    } as const;
  }

  function mapFiltersToPayload(
    filters: Record<TwinFilterKeys, unknown>
  ): TwinFilters {
    const result: TwinFilters = {
      twinIdList: toArrayOfString(toArray(filters.twinIdList), "id"),
      twinNameLikeList: toArrayOfString(
        toArray(filters.twinNameLikeList),
        "name"
      ).map(wrapWithPercent),
      twinClassIdList: toArrayOfString(toArray(filters.twinClassIdList), "id"),
      statusIdList: toArrayOfString(toArray(filters.statusIdList), "id"),
      createdByUserIdList: toArrayOfString(
        toArray(filters.createdByUserIdList),
        "userId"
      ),
      assignerUserIdList: toArrayOfString(
        toArray(filters.assignerUserIdList),
        "userId"
      ),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
      headTwinIdList: toArrayOfString(toArray(filters.headTwinIdList), "id"),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}

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
    createdAtFrom: {
      type: AutoFormValueType.string,
      label: "Created from",
      inputProps: { type: "date" },
    },
    createdAtTo: {
      type: AutoFormValueType.string,
      label: "Created to",
      inputProps: { type: "date" },
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
    const result: AttachmentFilters & {
      createdAt: DataTimeRangeV1;
    } = {
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
        from: filters.createdAtFrom ? `${filters.createdAtFrom}T00:00:00` : "",
        to: filters.createdAtTo ? `${filters.createdAtTo}T00:00:00` : "",
      },
    };
    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
