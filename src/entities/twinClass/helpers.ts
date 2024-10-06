import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { FilterFields, FILTERS } from "./constants";
import { mapToChoice } from "@/shared/helpers";

// List of filter keys for string-like filtering
const stringLikeFilters = [
    FilterFields.twinClassKeyLikeList,
    FilterFields.nameI18nLikeList,
    FilterFields.descriptionI18nLikeList,
];

// List of filter keys for choice-mapping
const choiceMappingFilters = [
    FilterFields.twinflowSchemaSpace,
    FilterFields.twinClassSchemaSpace,
    FilterFields.permissionSchemaSpace,
    FilterFields.aliasSpace,
    FilterFields.abstractt,
];

export const buildFilters = (filters: FiltersState): Record<string, any> => {
    return Object.entries(FILTERS).reduce<Record<string, any>>((acc, [filterKey, _]) => {
        const filterValue = filters?.filters[filterKey as keyof FiltersState['filters']];

        if (stringLikeFilters.includes(filterKey as FilterFields)) {
            acc[filterKey] = filterValue ? [`%${filterValue}%`] : [];
        }
        else if (choiceMappingFilters.includes(filterKey as FilterFields)) {
            acc[filterKey] = mapToChoice(filterValue);
        }
        else {
            acc[filterKey] = filterValue;
        }

        return acc;
    }, {});
};