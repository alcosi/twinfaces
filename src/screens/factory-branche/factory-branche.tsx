"use client";

import { Factory, FactoryResourceLink } from "@/entities/factory";
import {
  FactoryBranche,
  useFactoryBranchesSearch,
} from "@/entities/factory-branche";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable } from "@/widgets/crud-data-table";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Omit<
    FactoryBranche,
    "factoryId" | "factoryConditionSetId" | "nextFactoryId"
  >,
  ColumnDef<FactoryBranche>
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
    header: "Condition set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <GuidWithCopy value={original.factoryConditionSet?.id} />
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
    cell: ({ row: { original } }) =>
      original.nextFactory && (
        <div className="max-w-48 inline-flex">
          <FactoryResourceLink
            data={original.nextFactory as Factory}
            withTooltip
          />
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

export function FactoryBrancheScreen() {
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
