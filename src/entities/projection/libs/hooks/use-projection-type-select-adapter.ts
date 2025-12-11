import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  ProjectionType,
  ProjectionTypeFilters,
  useProjectionTypesSearch,
} from "../../api";

export function useProjectionTypeSelectAdapter(): SelectAdapter<ProjectionType> {
  const { searchProjectionTypes } = useProjectionTypesSearch();

  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id };
  }

  async function getItems(search: string, filters?: ProjectionTypeFilters) {
    const response = await searchProjectionTypes({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      filters: {
        nameLikeList: [wrapWithPercent(search)],
        ...filters,
      },
    });

    return response.data;
  }

  function renderItem({ name }: ProjectionType) {
    return isPopulatedString(name) ? name : "N/A";
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as ProjectionTypeFilters),
    renderItem,
  };
}
