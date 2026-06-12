import { TierIcon } from "@/features/tier/ui";
import { TiersScreen } from "@/screens/tiers";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Tiers"
      description="Manage data tiers."
      icon={TierIcon}
    >
      <TiersScreen />
    </TablePageLayout>
  );
}
