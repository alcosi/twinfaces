import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  PermissionSchemaFilterKeys,
  PermissionSchemaFilters,
} from "@/entities/permission-schema";
import { useUserSelectAdapter } from "@/entities/user";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

export function usePermissionSchemaFilters(): FilterFeature<
  PermissionSchemaFilterKeys,
  PermissionSchemaFilters
> {
  const uAdapter = useUserSelectAdapter();

  function buildFilterFields(): Record<
    PermissionSchemaFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },

      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },

      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },

      createdByUserIdList: {
        type: AutoFormValueType.combobox,
        label: "Created By",
        multi: true,
        ...uAdapter,
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<PermissionSchemaFilterKeys, unknown>
  ): PermissionSchemaFilters {
    const result: PermissionSchemaFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      nameLikeList: toArrayOfString(toArray(filters.nameLikeList), "name").map(
        wrapWithPercent
      ),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
      createdByUserIdList: toArrayOfString(
        toArray(filters.createdByUserIdList),
        "userId"
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
