import { ShieldCheck } from "lucide-react";

import { SpaceRolesScreen } from "@/screens/space-roles";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Space Roles"
      description="Manage space-level roles."
      icon={ShieldCheck}
    >
      <SpaceRolesScreen />
    </TablePageLayout>
  );
}
