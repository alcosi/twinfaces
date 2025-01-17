"use client";

import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { CrudDataTable } from "@/widgets/crud-data-table";
import {
  FactoryBranches,
  useFactoryBranchesSearch,
} from "@/entities/factoryBranches";
import { toast } from "sonner";
import { GuidWithCopy } from "@/shared/ui";
import { FactoryResourceLink } from "@/entities/factory";
import { Factory } from "@/entities/factory";
import { Check } from "lucide-react";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useEffect } from "react";

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
  // TODO: Replace with a condition set resource link
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition set",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        {original.factory && (
          <FactoryResourceLink data={original.factory as Factory} withTooltip />
        )}
      </div>
    ),
  },
  factoryConditionSetInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: "Condition invert",
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
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Branches", href: "/workspace/branches" }]);
  }, [setBreadcrumbs]);

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
      columns={[
        colDefs.id,
        colDefs.description,
        colDefs.factory,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.nextFactory,
        colDefs.active,
      ]}
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
