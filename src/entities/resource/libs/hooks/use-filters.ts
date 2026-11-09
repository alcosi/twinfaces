import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useUserFilters,
  useUserSelectAdapterWithFilters,
} from "@/entities/user";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { ResourceFilterKeys, ResourceFilters } from "../types";

export function useResourceFilters(): FilterFeature<
  ResourceFilterKeys,
  ResourceFilters
> {
  const userAdapter = useUserSelectAdapterWithFilters();
  const {
    buildFilterFields: buildUserFilters,
    mapFiltersToPayload: mapUserFilters,
  } = useUserFilters();

  function buildFilterFields(): Record<ResourceFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "ID",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      originalFileNameLikeList: {
        type: AutoFormValueType.tag,
        label: "File name",
      },
      uploadedByUserIdList: {
        type: AutoFormValueType.complexCombobox,
        label: "Uploaded by",
        adapter: userAdapter,
        extraFilters: buildUserFilters(),
        mapExtraFilters: (filters) => mapUserFilters(filters),
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
        multi: true,
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<ResourceFilterKeys, unknown>
  ): ResourceFilters {
    const idList = toArrayOfString(toArray(filters.idList), "id");
    const originalFileNameLikeList = toArrayOfString(
      toArray(filters.originalFileNameLikeList)
    ).map(wrapWithPercent);
    const uploadedByUserIdList = toArrayOfString(
      toArray(filters.uploadedByUserIdList),
      "userId"
    );

    return {
      ...(idList.length ? { idList } : {}),
      ...(originalFileNameLikeList.length ? { originalFileNameLikeList } : {}),
      ...(uploadedByUserIdList.length ? { uploadedByUserIdList } : {}),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
