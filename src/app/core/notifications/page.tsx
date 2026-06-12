import { Bell } from "lucide-react";

import { NotificationsScreen } from "@/screens/notifications/notifications";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Notifications"
      description="Manage system notifications."
      icon={Bell}
    >
      <NotificationsScreen />
    </TablePageLayout>
  );
}
