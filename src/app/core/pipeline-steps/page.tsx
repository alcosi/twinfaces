import { FactoryPipelineStepIcon } from "@/features/factory-pipeline-step/ui";
import { PipelineStepsScreen } from "@/screens/pipeline-steps";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function PipelineStepsPage() {
  return (
    <TablePageLayout
      title="Pipeline Steps"
      description="Configure pipeline step sequences."
      icon={FactoryPipelineStepIcon}
    >
      <PipelineStepsScreen />
    </TablePageLayout>
  );
}
