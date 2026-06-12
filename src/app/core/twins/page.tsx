import { TwinIcon } from "@/features/twin/ui";
import { TwinsScreen } from "@/screens/twins";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function TwinsPage() {
  return (
    <TablePageLayout
      title="Twins"
      description="Browse, filter, and manage every twin instance in your domain."
      icon={TwinIcon}
    >
      <TwinsScreen />
    </TablePageLayout>
  );
}
