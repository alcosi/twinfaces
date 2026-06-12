"use client";

import { Link2 } from "lucide-react";

import { LinksScreen } from "@/screens/links";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function LinksPage() {
  return (
    <TablePageLayout
      title="Links"
      description="Manage relationships between twin classes."
      icon={Link2}
    >
      <LinksScreen />
    </TablePageLayout>
  );
}
