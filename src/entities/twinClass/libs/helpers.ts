import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { RelatedObjects } from "@/shared/api";
import { mapToChoice, toArray, toArrayOfString } from "@/shared/libs";
import { TwinClass } from "../api";
import { FilterFields, FILTERS } from "./constants";
import { TwinClass_DETAILED } from "./types";

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

export const hydrateTwinClassFromMap = (
  twinClassDTO: TwinClass,
  relatedObjects?: RelatedObjects
): TwinClass_DETAILED => {
  const twinClass: TwinClass_DETAILED = Object.assign(
    {},
    twinClassDTO
  ) as TwinClass_DETAILED;

  if (!relatedObjects?.twinClassMap) return twinClass;

  if (twinClassDTO.headClassId) {
    twinClass.headClass = relatedObjects.twinClassMap[twinClassDTO.headClassId];
  }

  if (twinClassDTO.extendsClassId) {
    twinClass.extendsClass =
      relatedObjects.twinClassMap[twinClassDTO.extendsClassId];
  }

  return twinClass;
};
