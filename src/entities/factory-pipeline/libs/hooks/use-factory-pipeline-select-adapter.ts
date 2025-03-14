import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FactoryPipelineFilters,
  FactoryPipeline_DETAILED,
  useFactoryPipelineSearch,
  useFetchFactoryPipelineById,
} from "../../api";

export function useFactoryPipelineSelectAdapter(
  factoryId?: string
): SelectAdapter<FactoryPipeline_DETAILED> {
  const { searchFactoryPipelines } = useFactoryPipelineSearch();
  const { fetchFactoryPipelineById } = useFetchFactoryPipelineById();

  async function getById(id: string) {
    return await fetchFactoryPipelineById(id);
  }

  async function getItems(search: string, filters?: FactoryPipelineFilters) {
    const response = await searchFactoryPipelines({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      filters: {
        keyLikeList: [wrapWithPercent(search)],
        factoryIdList: factoryId ? [factoryId] : [],
        ...filters,
      },
    });

    return response.data;
  }

  function renderItem({ factory, inputTwinClass }: FactoryPipeline_DETAILED) {
    return `${isPopulatedString(factory.name) ? factory.name : "N/A"} | ${inputTwinClass.name}`;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as FactoryPipelineFilters),
    renderItem,
  };
}
