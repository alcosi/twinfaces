import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";
import { createContext, ReactNode, useEffect, useState } from "react";
import {
  PipelineStep_DETAILED,
  useFetchFactoryPipelineStepById,
} from "@/entities/factory-pipeline-step";

type PipelineStepContextProps = {
  stepId: string;
  step: PipelineStep_DETAILED;
  refresh: () => Promise<void>;
};

export const PipelineStepContext = createContext<PipelineStepContextProps>(
  {} as PipelineStepContextProps
);

export function PipelineStepContextProvider({
  stepId,
  children,
}: {
  stepId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [stepId]);

  const [step, setStep] = useState<PipelineStep_DETAILED | undefined>(
    undefined
  );
  const { fetchFactoryPipelineStepById, loading } =
    useFetchFactoryPipelineStepById();

  async function refresh() {
    try {
      const response = await fetchFactoryPipelineStepById({
        stepId,
        query: {
          showFactoryPipelineStepMode: "DETAILED",
          showFactoryPipeline2FactoryMode: "DETAILED",
          showFactoryPipelineStep2FactoryPipelineMode: "DETAILED",
          showFactoryPipelineStep2FeaturerMode: "DETAILED",
          showFactoryPipelineStep2FactoryConditionSetMode: "DETAILED",
        },
      });
      setStep(response);
    } catch (error) {
      console.error("Failed to fetch pipeline step:", error);
    }
  }

  if (isUndefined(step) || loading) return <LoadingOverlay />;

  return (
    <PipelineStepContext.Provider value={{ stepId, step, refresh }}>
      {loading ? <LoadingOverlay /> : children}
    </PipelineStepContext.Provider>
  );
}
