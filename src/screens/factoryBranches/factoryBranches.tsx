"use client";

import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { CrudDataTable } from "../../widgets/crud-data-table";
import {
  FactoryBranches,
  useFactoryBranchesSearch,
} from "@/entities/factoryBranches";
import { toast } from "sonner";
import { GuidWithCopy } from "@/shared/ui";
import { FactoryResourceLink } from "@/entities/factory/components/resource-link/resource-link";
import { Factory } from "@/entities/factory";
import { Check } from "lucide-react";

const colDefs: Record<
  keyof Omit<
    FactoryBranches,
    "factoryId" | "factoryConditionSetId" | "nextFactoryId"
  >,
  ColumnDef<FactoryBranches>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  factory: {
    id: "factory",
    accessorKey: "factory",
    header: "Factory",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        {original.factory && (
          <FactoryResourceLink data={original.factory as Factory} withTooltip />
        )}
      </div>
    ),
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Factory Condition Set",
    cell: ({ row: { original } }) => (
      <span>{original.factoryConditionSet?.name}</span>
    ),
  },
  factoryConditionSetInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: "Factory Condition Set Invert",
    cell: (data) => data.getValue() && <Check />,
  },
  nextFactory: {
    id: "nextFactory",
    accessorKey: "nextFactory",
    header: "Next Factory",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        {original.nextFactory && (
          <FactoryResourceLink
            data={original.nextFactory as Factory}
            withTooltip
          />
        )}
      </div>
    ),
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function FactoryBranchesScreen() {
  const { searchFactoryBranches } = useFactoryBranchesSearch();
  async function fetchFactoryBranches(
    pagination: PaginationState,
    filters: {}
  ) {
    try {
      return await searchFactoryBranches({ pagination });
    } catch (error) {
      toast.error("An error occurred while factory branches: " + error);
      throw new Error("An error occurred while factory branches: " + error);
    }
  }

  return (
    <CrudDataTable
      columns={Object.values(colDefs) as ColumnDef<FactoryBranches>[]}
      fetcher={fetchFactoryBranches}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.nextFactory,
        colDefs.active,
      ]}
    />
  );
}
