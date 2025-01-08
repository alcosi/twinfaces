import { type FilterFeature } from "@/shared/libs";
import { z } from "zod";
import {
  AutoFormValueInfo,
  AutoFormValueType,
} from "../../../../components/auto-field";
import { FeaturerFilterKeys, FeaturerFilters } from "../../api";
import { FeaturerTypes } from "@/entities/featurer";
import { useFeaturerSelectAdapter } from "./useSelectAdapter";

export function useFeaturerFilters(): FilterFeature<
  FeaturerFilterKeys,
  FeaturerFilters
> {
  const { getById, getItems, renderItem } = useFeaturerSelectAdapter(
    FeaturerTypes.fieldTyper
  );

  function buildFilterFields(): Record<FeaturerFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      typeIdList: {
        type: AutoFormValueType.string,
        label: "Type",
      },
      nameLikeList: {
        type: AutoFormValueType.string,
        label: "Name",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FeaturerFilterKeys, unknown>
  ): FeaturerFilters {
    const result: FeaturerFilters = {
      // TODO: add logic here
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
