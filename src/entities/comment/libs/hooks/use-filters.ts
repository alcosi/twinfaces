import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { CommentFilterKeys, CommentFilters } from "@/entities/comment";
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
  wrapWithPercent,
} from "@/shared/libs";

export function useCommentFilters({
  enabledFilters,
}: {
  enabledFilters?: CommentFilterKeys[];
} = {}): FilterFeature<CommentFilterKeys, CommentFilters> {
  const twinAdapter = useTwinSelectAdapterWithFilters();
  const userAdapter = useUserSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinFilters,
    mapFiltersToPayload: mapTwinFilters,
  } = useTwinFilters({});
  const {
    buildFilterFields: buildUserFilters,
    mapFiltersToPayload: mapUserFilters,
  } = useUserFilters();

  const allFilters: Record<CommentFilterKeys, AutoFormValueInfo> = {
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
    textLikeList: {
      type: AutoFormValueType.tag,
      label: "Text",
    },
    createdAt: {
      type: AutoFormValueType.dateRange,
      label: "Created",
    },
  };

  function buildFilterFields(): Record<CommentFilterKeys, AutoFormValueInfo> {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<CommentFilterKeys, unknown>
  ): CommentFilters {
    const createdAt = filters.createdAt as { from?: string; to?: string };
    const result: CommentFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      twinIdList: toArrayOfString(toArray(filters.twinIdList), "id"),
      createdByUserIdList: toArrayOfString(
        toArray(filters.createdByUserIdList),
        "userId"
      ),
      textLikeList: toArrayOfString(toArray(filters.textLikeList), "id").map(
        wrapWithPercent
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
