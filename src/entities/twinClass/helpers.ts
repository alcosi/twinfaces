import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { mapToChoice, toArray } from "@/shared/helpers";
import { FilterFields, FILTERS } from "./constants";

const stringLikeFilters = [
  FilterFields.twinClassKeyLikeList,
  FilterFields.nameI18nLikeList,
  FilterFields.descriptionI18nLikeList,
];

const arrayLikeFilters = [
  FilterFields.twinClassIdList,
  FilterFields.headTwinClassIdList,
  FilterFields.extendsTwinClassIdList,
  FilterFields.ownerTypeList,
];

const choiceMappingFilters = [
  FilterFields.twinflowSchemaSpace,
  FilterFields.twinClassSchemaSpace,
  FilterFields.permissionSchemaSpace,
  FilterFields.aliasSpace,
  FilterFields.abstractt,
];

// Warning: temp solution
// TODO: Find better solution
const toArrayOfString = <T extends { id?: string }>(
  input: T[] | string[]
): string[] => {
  if (input.every((item) => typeof item === "string")) {
    return input as string[];
  }

  return (input as T[]).map((item) => item.id || "").filter((id) => id !== "");
};

export const buildFilters = (filters: FiltersState): Record<string, any> => {
  return Object.entries(FILTERS).reduce<Record<string, any>>(
    (acc, [filterKey, _]) => {
      const filterValue =
        filters?.filters[filterKey as keyof FiltersState["filters"]];

      if (stringLikeFilters.includes(filterKey as FilterFields)) {
        acc[filterKey] = filterValue ? [`%${filterValue}%`] : [];
      } else if (arrayLikeFilters.includes(filterKey as FilterFields)) {
        acc[filterKey] = toArrayOfString(toArray(filterValue));
      } else if (choiceMappingFilters.includes(filterKey as FilterFields)) {
        acc[filterKey] = mapToChoice(filterValue);
      } else {
        acc[filterKey] = filterValue;
      }

      return acc;
    },
    {}
  );
};
