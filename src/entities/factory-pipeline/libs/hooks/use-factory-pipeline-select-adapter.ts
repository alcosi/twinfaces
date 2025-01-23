import {
  isPopulatedString,
  SelectAdapter,
  wrapWithPercent,
} from "@/shared/libs";
import {
  FactoryPipeline,
  FactoryPipelineFilters,
  useFactoryPipelineSearch,
} from "../../api";
import { useFetchFactoryPipelineById } from "./use-fetch-factory-pipeline-by-id";

export function useFactoryPipelineSelectAdapter(): SelectAdapter<FactoryPipeline> {
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
        ...filters,
      },
    });

    return response.data;
  }

  function renderItem({ factoryId, id }: FactoryPipeline) {
    return isPopulatedString(id) ? id : factoryId;
  }

  return {
    getById,
    getItems: (search, options) =>
      getItems(search, options as FactoryPipelineFilters),
    renderItem,
  };
}
