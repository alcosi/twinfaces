import { Tag } from "lucide-react";

import { TwinClassDynamicMarkersScreen } from "@/screens/twin-class-dynamic-markers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Dynamic Markers"
      description="Configure dynamic markers for twin classes."
      icon={Tag}
    >
      <TwinClassDynamicMarkersScreen />
    </TablePageLayout>
  );
}
