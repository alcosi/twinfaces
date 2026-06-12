import { FactoryPipelineIcon } from "@/features/factory-pipeline/ui";
import { FactoryPipelinesScreen } from "@/screens/factory-pipelines";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Factory Pipelines"
      description="Define factory processing pipelines."
      icon={FactoryPipelineIcon}
    >
      <FactoryPipelinesScreen />
    </TablePageLayout>
  );
}
