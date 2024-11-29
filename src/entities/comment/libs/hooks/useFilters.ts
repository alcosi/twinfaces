import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  CommentFilterKeys,
  CommentFilters,
  useCommentSelectAdapter,
} from "@/entities/comment";
import { type FilterFeature } from "@/shared/libs";
import { z } from "zod";

export function useCommentFilters(): FilterFeature<
  CommentFilterKeys,
  CommentFilters
> {
  const { getById, getItems, getItemKey, getItemLabel } =
    useCommentSelectAdapter();

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
