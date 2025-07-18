import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { FaceWT001 } from "@/entities/face";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { TwinFilterKeys, TwinFilters } from "@/entities/twin/server";
import { useUserSelectAdapter } from "@/entities/user";
import {
  type FilterFeature,
  isObject,
  isPopulatedArray,
  isTruthy,
  isUndefined,
  keyBy,
  reduceToObject,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  STATIC_TWIN_FIELD_KEY_TO_ID_MAP,
  TWIN_CLASS_FIELD_TYPE_TO_SEARCH_PAYLOAD,
} from "../constants";
import { SearchableTwinFieldType } from "../types";
import { useTwinSelectAdapter } from "./use-select-adapter";

export function useTwinFilters({
  baseTwinClassId,
  twinClassFields,
  enabledColumns,
}: {
  baseTwinClassId?: string;
  twinClassFields?: TwinClass_DETAILED["fields"];
  enabledColumns?: FaceWT001["columns"];
}): FilterFeature<TwinFilterKeys, TwinFilters> {
  const tcAdapter = useTwinClassSelectAdapter();
  const sAdapter = useTwinStatusSelectAdapter();
  const uAdapter = useUserSelectAdapter();
  const tAdapter = useTwinSelectAdapter();

  function buildFilterFields(
    filters?: TwinFilterKeys[]
  ): Partial<Record<TwinFilterKeys, AutoFormValueInfo>> {
    const columnById = keyBy(
      enabledColumns ?? [],
      (col) => col.twinClassFieldId!
    );

    const selfFilters: Partial<Record<TwinFilterKeys, AutoFormValueInfo>> = {
      twinIdList: {
        type: AutoFormValueType.tag,
        label: columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["id"]]?.label ?? "ID",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      twinClassIdList: {
        type: AutoFormValueType.combobox,
        label:
          columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["twinClassId"]]?.label ??
          "Twin Class",
        multi: true,
        ...tcAdapter,
        getItems: (search: string) => {
          if (baseTwinClassId) {
            tcAdapter.getItems(search, {
              abstractt: "ONLY_NOT",
              extendsHierarchyChildsForTwinClassSearch: baseTwinClassId
                ? { idList: [baseTwinClassId], depth: 0 }
                : undefined,
            });
          }

          return tcAdapter.getItems(search);
        },
      },

      statusIdList: {
        type: AutoFormValueType.combobox,
        label:
          columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["statusId"]]?.label ??
          "Status",
        multi: true,
        ...sAdapter,
        getItems: async (search: string) =>
          sAdapter.getItems(search, {
            twinClassIdMap: reduceToObject({
              list: toArray(baseTwinClassId),
              defaultValue: true,
            }),
          }),
      },
      twinNameLikeList: {
        type: AutoFormValueType.tag,
        label:
          columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["name"]]?.label ?? "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.string,
        label:
          columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["description"]]?.label ??
          "Description",
      },
      headTwinIdList: {
        type: AutoFormValueType.combobox,
        label:
          columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["headTwinId"]]?.label ??
          "Head",
        multi: true,
        ...tAdapter,
      },
      createdByUserIdList: {
        type: AutoFormValueType.combobox,
        label:
          columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["authorUserId"]]?.label ??
          "Author",
        multi: true,
        ...uAdapter,
      },
      assignerUserIdList: {
        type: AutoFormValueType.combobox,
        label:
          columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["assignerUserId"]]
            ?.label ?? "Assignee",
        multi: true,
        ...uAdapter,
      },
      createdAt: {
        type: AutoFormValueType.string,
        label:
          columnById[STATIC_TWIN_FIELD_KEY_TO_ID_MAP["createdAt"]]?.label ??
          "Created at",
        input_props: { type: "date" },
      },
    } as const;

    const filteredSelfFilters = filters
      ? filters.reduce(
          (acc, key) => {
            const filter = selfFilters[key];

            if (isTruthy(filter)) {
              acc[key] = filter;
            }
            return acc;
          },
          {} as Partial<Record<TwinFilterKeys, AutoFormValueInfo>>
        )
      : selfFilters;

    const inheritedFields =
      twinClassFields?.reduce<Record<string, AutoFormValueInfo>>(
        (acc, field) => {
          const column = enabledColumns?.find(
            (col) => col.twinClassFieldId === field.id
          );

          acc[`fields.${field.key}`] = {
            type: AutoFormValueType.twinField,
            label: column?.label ?? field.name,
            twinClassId: baseTwinClassId!,
            descriptor: field.descriptor,
          };

          return acc;
        },
        {}
      ) ?? {};

    return { ...filteredSelfFilters, ...inheritedFields };
  }

  function mapFiltersToPayload(
    filters: Record<TwinFilterKeys, unknown>
  ): TwinFilters {
    const fields =
      isObject(filters.fields) && isPopulatedArray(twinClassFields)
        ? mapInheritedFieldFiltersToPayload(
            filters.fields as Record<string, string | undefined>,
            twinClassFields
          )
        : {};

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
      createdAt: {
        from: filters.createdAt ? `${filters.createdAt}T00:00:00` : "",
        to: filters.createdAt ? `${filters.createdAt}T23:59:59` : "",
      },
      fields: fields,
    };

    return result;
  }

  return { buildFilterFields, mapFiltersToPayload };
}

function mapInheritedFieldFiltersToPayload(
  filterFields: Record<string, string | undefined>,
  twinClassFields: NonNullable<TwinClass_DETAILED["fields"]>
): NonNullable<TwinFilters["fields"]> {
  return twinClassFields.reduce<NonNullable<TwinFilters["fields"]>>(
    (acc, { id: fieldId, key: fieldKey, descriptor }) => {
      if (
        isUndefined(fieldId) ||
        isUndefined(fieldKey) ||
        isUndefined(descriptor?.fieldType) ||
        isUndefined(filterFields[fieldKey])
      ) {
        return acc;
      }

      acc[fieldId] = TWIN_CLASS_FIELD_TYPE_TO_SEARCH_PAYLOAD[
        descriptor.fieldType as SearchableTwinFieldType
      ](filterFields[fieldKey]!);

      return acc;
    },
    {}
  );
}
