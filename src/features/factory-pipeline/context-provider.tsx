import { ReactNode, createContext, useEffect, useState } from "react";

import {
  FactoryPipeline_DETAILED,
  useFetchFactoryPipelineById,
} from "@/entities/factory-pipeline";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type FactoryPipelineContexProps = {
  pipelineId: string;
  pipeline: FactoryPipeline_DETAILED;
  refresh: () => Promise<void>;
};

export const FactoryPipelineContext = createContext<FactoryPipelineContexProps>(
  {} as FactoryPipelineContexProps
);

export function FactoryPipelineContextProvider({
  pipelineId,
  children,
}: {
  pipelineId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [pipelineId]);

  const [pipeline, setPipeline] = useState<
    FactoryPipeline_DETAILED | undefined
  >(undefined);

  const { fetchFactoryPipelineById, loading } = useFetchFactoryPipelineById();

  async function refresh() {
    try {
      const fetchedFactoryPipeline = await fetchFactoryPipelineById(pipelineId);

      if (fetchedFactoryPipeline) {
        setPipeline(fetchedFactoryPipeline);
      }
    } catch (error) {
      console.error("Failed to fetch factory pipeline:", error);
    }
  }

  if (isUndefined(pipeline) || loading) return <LoadingOverlay />;

  return (
    <FactoryPipelineContext.Provider value={{ pipelineId, pipeline, refresh }}>
      {loading ? <LoadingOverlay /> : children}
    </FactoryPipelineContext.Provider>
  );
}
