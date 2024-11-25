import { FiltersState } from "@/shared/ui/data-table/crud-data-table";

import { FilterFields, FILTERS } from "@/entities/datalist/libs/constants";
import { mapToChoice, toArray, toArrayOfString } from "@/shared/libs";

const stringLikeFilters: FilterFields[] = [
  FilterFields.nameLikeList,
  FilterFields.descriptionLikeList,
  FilterFields.keyLikeList,
];

const arrayLikeFilters: FilterFields[] = [FilterFields.idList];

const choiceMappingFilters: FilterFields[] = [];

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
