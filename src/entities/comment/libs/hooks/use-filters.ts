import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { CommentFilterKeys, CommentFilters } from "@/entities/comment";
import { type FilterFeature } from "@/shared/libs";

export function useCommentFilters(): FilterFeature<
  CommentFilterKeys,
  CommentFilters
> {
  function buildFilterFields(): Record<CommentFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<CommentFilterKeys, unknown>
  ): CommentFilters {
    const result: CommentFilters = {
      // TODO: add logic here
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
