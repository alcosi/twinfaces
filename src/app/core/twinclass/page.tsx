"use client";

import { TwinClassIcon } from "@/features/twin-class/ui";
import { TwinClasses } from "@/screens/twin-classes";
import { TablePageLayout } from "@/widgets/table-page-layout";

export default function TwinClassesPage() {
  return (
    <TablePageLayout
      title="Twin Classes"
      description="Define twin class templates, hierarchies, and relationships."
      icon={TwinClassIcon}
      variant="fill"
    >
      <TwinClasses />
    </TablePageLayout>
  );
}
