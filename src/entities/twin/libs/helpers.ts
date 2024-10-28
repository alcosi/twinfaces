import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { FilterFields, FILTERS } from "./constants";
import { mapToChoice, toArray } from "@/shared/libs";
import { RelatedObjects } from "@/lib/api/api-types";
import { Twin, TwinBase } from "./types";
import { TwinClass_DETAILED } from "../../twinClass";
import { User } from "../../user";
import { TwinClassStatus } from "@/entities/twinClassStatus";

// List of filter keys for string-like filtering
const stringLikeFilters = [FilterFields.twinNameLikeList];

const arrayLikeFilters = [
  FilterFields.twinIdList,
  FilterFields.twinClassIdList,
  FilterFields.statusIdList,
  FilterFields.createdByUserIdList,
  FilterFields.assignerUserIdList,
  FilterFields.headTwinIdList,
  FilterFields.tagDataListOptionIdList,
  FilterFields.markerDataListOptionIdList,
];

// List of filter keys for choice-mapping
const choiceMappingFilters: any = [];

const toArrayOfString = <T extends { [key: string]: any }>(
  input: T[] | string[],
  key: keyof T = "id"
): string[] => {
  if (input.every((item) => typeof item === "string")) {
    return input as string[];
  }

  return (input as T[])
    .map((item) => item[key] || "")
    .filter((value) => value !== "");
};

export const buildFilters = (filters: FiltersState): Record<string, any> => {
  return Object.entries(FILTERS).reduce<Record<string, any>>(
    (acc, [filterKey, _]) => {
      const filterValue =
        filters?.filters[filterKey as keyof FiltersState["filters"]];

      if (stringLikeFilters.includes(filterKey as FilterFields)) {
        acc[filterKey] = filterValue ? [`%${filterValue}%`] : [];
      } else if (arrayLikeFilters.includes(filterKey as FilterFields)) {
        const key = getKeyByFilter(filterKey);
        acc[filterKey] = toArrayOfString(toArray(filterValue), key);
      } else if (choiceMappingFilters.includes(filterKey as FilterFields)) {
        acc[filterKey] = mapToChoice(filterValue);
      } else {
        acc[filterKey] = Array.isArray(filterValue)
          ? toArrayOfString(filterValue)
          : filterValue;
      }

      return acc;
    },
    {}
  );
};

const getKeyByFilter = (filterKey: string): string => {
  switch (filterKey) {
    case "twinClassIdList":
      return "twinClassId";
    case "statusIdList":
      return "statusId";
    default:
      return "headTwinId";
  }
};

export const hydrateTwinFromMap = (
  twinDTO: TwinBase,
  relatedObjects?: RelatedObjects
): Twin => {
  const twin: Twin = Object.assign({}, twinDTO) as Twin;

  if (!relatedObjects?.twinClassMap) return twin;

  if (twinDTO.statusId && relatedObjects.statusMap) {
    twin.status = relatedObjects.statusMap[twinDTO.statusId] as TwinClassStatus;
  }

  if (twinDTO.twinClassId) {
    twin.twinClass = relatedObjects.twinClassMap[
      twinDTO.twinClassId
    ] as TwinClass_DETAILED;
  }

  if (twinDTO.authorUserId && relatedObjects.userMap) {
    twin.authorUser = relatedObjects.userMap[twinDTO.authorUserId] as User;
  }

  if (twinDTO.assignerUserId && relatedObjects.userMap) {
    twin.assignerUser = relatedObjects.userMap[twinDTO.assignerUserId] as User;
  }

  return twin;
};
