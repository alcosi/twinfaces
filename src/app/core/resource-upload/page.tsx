import { FileUp } from "lucide-react";

import { ResourceUploadScreen } from "@/screens/resource-upload";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Resource upload"
      description="Upload files to the platform storage via /private/resource/upload/v1."
      icon={FileUp}
      variant="flow"
    >
      <ResourceUploadScreen />
    </TablePageLayout>
  );
}
