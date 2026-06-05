import { useRef, useState } from "react";

import { SelectAdapterWithFilters, wrapWithPercent } from "@/shared/libs";

import {
  FactoryPipelineFilters,
  FactoryPipeline_DETAILED,
  useFactoryPipelineSearch,
  useFetchFactoryPipelineById,
} from "../../api";

export function useFactoryPipelineSelectAdapterWithFilters(
  factoryId?: string
): SelectAdapterWithFilters<FactoryPipeline_DETAILED, FactoryPipelineFilters> {
  const { searchFactoryPipelines } = useFactoryPipelineSearch();
  const { fetchFactoryPipelineById } = useFetchFactoryPipelineById();

  const filtersRef = useRef<FactoryPipelineFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: FactoryPipelineFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    return await fetchFactoryPipelineById(id);
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const descriptionLikeList = [
      ...(search ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.descriptionLikeList ?? []),
    ];

    const response = await searchFactoryPipelines({
      pagination,
      filters: {
        factoryIdList: factoryId ? [factoryId] : [],
        ...filtersRef.current,
        descriptionLikeList,
      },
    });

    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ description }: FactoryPipeline_DETAILED) {
    return description;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
    setFilters,
    invalidate,
    version,
  };
}
