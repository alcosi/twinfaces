import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useUserSelectAdapter } from "@/entities/user";
import {
  type FilterFeature,
  isUndefined,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { TwinFilterKeys, TwinFilters } from "../../api";
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
