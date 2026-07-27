import { Waypoints } from "lucide-react";

import { TwinLinksScreen } from "@/screens/twin-links";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Twin links"
      description="Browse and analyze links between twins across the domain."
      icon={Waypoints}
    >
      <TwinLinksScreen />
    </TablePageLayout>
  );
}
