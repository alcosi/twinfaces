import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  ProjectionType,
  ProjectionTypeFilters,
  useFetchProjectionTypeById,
  useProjectionTypesSearch,
} from "../../api";

export function useProjectionTypeSelectAdapter(): SelectAdapter<ProjectionType> {
  const { searchProjectionTypes } = useProjectionTypesSearch();
  const { fetchProjectionTypeById } = useFetchProjectionTypeById();

  async function getById(id: string) {
    return await fetchProjectionTypeById(id);
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
