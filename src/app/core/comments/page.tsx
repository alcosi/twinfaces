import { MessageCircle } from "lucide-react";

import { CommentsScreen } from "@/screens/comments";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function Page() {
  return (
    <TablePageLayout
      title="Comments"
      description="Browse and analyze comments across all twins."
      icon={MessageCircle}
    >
      <CommentsScreen />
    </TablePageLayout>
  );
}
