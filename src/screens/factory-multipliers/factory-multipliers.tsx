"use-client";

import { FactoryMultiplier_DETAILED } from "@/entities/factory-multiplier";
import { GuidWithCopy } from "@/shared/ui";
import { ColumnDef } from "@tanstack/react-table";

const colDefs: Record<
  keyof Pick<FactoryMultiplier_DETAILED, "id">,
  ColumnDef<FactoryMultiplier_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
};

export function FactoryMultipliersScreen() {
  return <h1>FactoryMultipliersPage</h1>;
}
