import { FilterFeature, toArrayOfString, wrapWithPercent } from "@/shared/libs";
import { FactoryFilterKeys, FactoryFilters } from "@/entities/factory";
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";

export function useFactoryFilters(): FilterFeature<
  FactoryFilterKeys,
  FactoryFilters
> {
  function buildFilterFields(): Record<FactoryFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      keyLikeList: {
        type: AutoFormValueType.tag,
        label: "Key",
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.string,
        label: "Description",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryFilterKeys, unknown>
  ): FactoryFilters {
    return {
      idList: toArrayOfString(filters.idList),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      descriptionLikeList: toArrayOfString(filters.descriptionLikeList).map(
        wrapWithPercent
      ),
      keyLikeList: toArrayOfString(filters.keyLikeList).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
