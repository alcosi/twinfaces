import { Share2 } from "lucide-react";

import { ProjectionsScreen } from "@/screens/projections";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Projections"
      description="Manage data field projections."
      icon={Share2}
    >
      <ProjectionsScreen />
    </TablePageLayout>
  );
}
