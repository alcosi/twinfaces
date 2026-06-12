"use client";

import { List } from "lucide-react";

import { DatalistOptionsScreen } from "@/screens/datalist-options";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function OptionsPage() {
  return (
    <TablePageLayout
      title="Datalist Options"
      description="Configure datalist option entries."
      icon={List}
    >
      <DatalistOptionsScreen />
    </TablePageLayout>
  );
}
