import { SelectAdapter, wrapWithPercent } from "@/shared/libs";

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
        descriptionLikeList: [wrapWithPercent(search)],
        factoryIdList: factoryId ? [factoryId] : [],
        ...filters,
      },
    });

    return response.data;
  }

  function renderItem({ description }: FactoryPipeline_DETAILED) {
    // Originally, TWINFACES-326 requested displaying: `${factory.name} | ${inputTwinClass.name}`
    // However, the backend does not support filtering by factory.name or inputTwinClass.name.
    // TODO: Revisit the ticket with the BE team to explore a solution.
    return description;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as FactoryPipelineFilters),
    renderItem,
  };
}
