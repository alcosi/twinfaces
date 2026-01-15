import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { usePermissionSelectAdapter } from "@/entities/permission";
import {
  OWNER_TYPES,
  TwinClassFilterKeys,
  TwinClassFilters,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { useTwinClassFreezeSelectAdapter } from "@/entities/twin-class-freeze";
import {
  type FilterFeature,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { useDatalistSelectAdapter } from "../../../datalist";

export function useTwinClassFilters(): FilterFeature<
  TwinClassFilterKeys,
  TwinClassFilters
> {
  const tcAdapter = useTwinClassSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const dlAdapter = useDatalistSelectAdapter();
  const fAdapter = useTwinClassFreezeSelectAdapter();

  function buildFilterFields(): Partial<
    Record<TwinClassFilterKeys, AutoFormValueInfo>
  > {
    return {
      twinClassIdList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      twinClassKeyLikeList: {
        type: AutoFormValueType.tag,
        label: "Key",
      },
      nameI18nLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      descriptionI18nLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
      headHierarchyParentsForTwinClassSearch: {
        type: AutoFormValueType.combobox,
        label: "Head",
        multi: true,
        ...tcAdapter,
        getItems: async (search: string) => {
          return tcAdapter.getItems(search, { abstractt: "ONLY_NOT" });
        },
      },
      extendsHierarchyParentsForTwinClassSearch: {
        type: AutoFormValueType.combobox,
        label: "Extends",
        multi: true,
        ...tcAdapter,
      },
      extendsHierarchyChildsForTwinClassSearch: undefined,
      ownerTypeList: {
        type: AutoFormValueType.combobox,
        label: "Owner types",
        getById: async (key: string) => OWNER_TYPES?.find((o) => o === key),
        getItems: async (needle: string) => {
          return OWNER_TYPES?.filter((type) =>
            type.toLowerCase().includes(needle.toLowerCase())
          );
        },
        getItemKey: (o: unknown) => o as string,
        renderItem: (o: unknown) => o as string,
        multi: true,
      },
      assigneeRequired: {
        type: AutoFormValueType.boolean,
        label: "Assignee required",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      twinflowSchemaSpace: {
        type: AutoFormValueType.boolean,
        label: "Twinflow schema space",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      twinClassSchemaSpace: {
        type: AutoFormValueType.boolean,
        label: "Twinclass schema space",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      permissionSchemaSpace: {
        type: AutoFormValueType.boolean,
        label: "Permission schema space",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      aliasSpace: {
        type: AutoFormValueType.boolean,
        label: "Alias space",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      abstractt: {
        type: AutoFormValueType.boolean,
        label: "Abstract",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      createPermissionIdList: {
        type: AutoFormValueType.combobox,
        label: "Create permission",
        multi: true,
        ...pAdapter,
      },
      viewPermissionIdList: {
        type: AutoFormValueType.combobox,
        label: "View permission",
        multi: true,
        ...pAdapter,
      },
      editPermissionIdList: {
        type: AutoFormValueType.combobox,
        label: "Edit permission",
        multi: true,
        ...pAdapter,
      },
      deletePermissionIdList: {
        type: AutoFormValueType.combobox,
        label: "Delete permission",
        multi: true,
        ...pAdapter,
      },
      markerDatalistIdList: {
        type: AutoFormValueType.combobox,
        label: "Markers list",
        multi: true,
        ...dlAdapter,
      },
      tagDatalistIdList: {
        type: AutoFormValueType.combobox,
        label: "Tags list",
        multi: true,
        ...dlAdapter,
      },
      segment: {
        type: AutoFormValueType.boolean,
        label: "Segment",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      hasSegments: {
        type: AutoFormValueType.boolean,
        label: "Has segment",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      externalIdLikeList: {
        type: AutoFormValueType.tag,
        label: "External Id",
      },
      freezeIdList: {
        label: "Freeze",
        type: AutoFormValueType.combobox,
        multi: true,
        ...fAdapter,
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<TwinClassFilterKeys, unknown>
  ): TwinClassFilters {
    const result: TwinClassFilters = {
      twinClassIdList: toArrayOfString(filters.twinClassIdList),
      twinClassKeyLikeList: toArrayOfString(filters.twinClassKeyLikeList).map(
        wrapWithPercent
      ),
      nameI18nLikeList: toArrayOfString(filters.nameI18nLikeList).map(
        wrapWithPercent
      ),
      descriptionI18nLikeList: toArrayOfString(
        toArray(filters.descriptionI18nLikeList),
        "description"
      ).map(wrapWithPercent),
      headHierarchyParentsForTwinClassSearch: {
        idList: toArrayOfString(
          toArray(filters.headHierarchyParentsForTwinClassSearch),
          "id"
        ),
      },
      extendsHierarchyParentsForTwinClassSearch: {
        idList: toArrayOfString(
          toArray(filters.extendsHierarchyParentsForTwinClassSearch),
          "id"
        ),
      },
      extendsHierarchyChildsForTwinClassSearch: undefined,
      ownerTypeList: toArray(
        filters.ownerTypeList as TwinClassFilters["ownerTypeList"]
      ),
      assigneeRequired: mapToChoice(filters.assigneeRequired),
      twinflowSchemaSpace: mapToChoice(filters.twinflowSchemaSpace),
      twinClassSchemaSpace: mapToChoice(filters.twinClassSchemaSpace),
      permissionSchemaSpace: mapToChoice(filters.permissionSchemaSpace),
      aliasSpace: mapToChoice(filters.aliasSpace),
      abstractt: mapToChoice(filters.abstractt),
      viewPermissionIdList: toArrayOfString(
        toArray(filters.viewPermissionIdList),
        "id"
      ),
      createPermissionIdList: toArrayOfString(
        toArray(filters.createPermissionIdList),
        "id"
      ),
      editPermissionIdList: toArrayOfString(
        toArray(filters.editPermissionIdList),
        "id"
      ),
      deletePermissionIdList: toArrayOfString(
        toArray(filters.deletePermissionIdList),
        "id"
      ),
      markerDatalistIdList: toArrayOfString(
        toArray(filters.markerDatalistIdList),
        "id"
      ),
      tagDatalistIdList: toArrayOfString(
        toArray(filters.tagDatalistIdList),
        "id"
      ),
      segment: mapToChoice(filters.segment),
      hasSegments: mapToChoice(filters.hasSegments),
      externalIdLikeList: toArrayOfString(filters.externalIdLikeList).map(
        wrapWithPercent
      ),
      freezeIdList: toArrayOfString(toArray(filters.freezeIdList), "id"),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
