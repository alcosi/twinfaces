import { useContext, useEffect, useState } from "react";

import { FactoryContext } from "@/features/factory";
import { LoadingOverlay } from "@/shared/ui";
import {
  FactoryBranchesTable,
  FactoryMultipliersTable,
  FactoryPipelinesTable,
  PipelineStepsTable,
} from "@/widgets/tables";

export function FactoryFlow() {
  const { factoryId } = useContext(FactoryContext);

  // TODO: Remove this useEffect by resolving `https://alcosi.atlassian.net/browse/TWINFACES-467`
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) return <LoadingOverlay />;

  return (
    <div className="space-y-16 pb-8">
      <FactoryMultipliersTable factoryId={factoryId} title="Multipliers" />
      <FactoryPipelinesTable factoryId={factoryId} title="Pipelines" />
      <PipelineStepsTable factoryId={factoryId} title="PipelineSteps" />
      <FactoryBranchesTable factoryId={factoryId} title="Branches" />
      {/* //TODO add Erasers table task https://alcosi.atlassian.net/browse/TWINFACES-316  */}
    </div>
  );
}
