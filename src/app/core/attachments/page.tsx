import { Paperclip } from "lucide-react";

import { AttachmentsScreen } from "@/screens/attachments";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Attachments"
      description="Manage file attachments and uploads."
      icon={Paperclip}
    >
      <AttachmentsScreen />
    </TablePageLayout>
  );
}
