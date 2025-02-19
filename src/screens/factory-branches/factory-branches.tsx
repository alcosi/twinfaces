"use client";

import { Factory, FactoryResourceLink } from "@/entities/factory";
import {
  FACTORY_BRANCHE_SCHEMA,
  FactoryBranche,
  useFactoryBrancheFilters,
  useFactoryBranchesSearch,
} from "@/entities/factory-branche";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { FactoryConditionSetResourceLink } from "@/entities/factory-condition-set";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryBrancheFormFields } from "./form-fields";

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
  factory: {
    id: "factory",
    accessorKey: "factory",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="max-w-48 inline-flex">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="max-w-48 inline-flex">
          <FactoryConditionSetResourceLink
            data={original.factoryConditionSet}
            withTooltip
          />
        </div>
      ),
  },
  factoryConditionSetInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: "Condition invert",
    cell: (data) => data.getValue() && <Check />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
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
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
};

export function FactoryBranchesScreen() {
  const { searchFactoryBranches } = useFactoryBranchesSearch();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryBrancheFilters();

  useEffect(() => {
    setBreadcrumbs([{ label: "Branches", href: "/workspace/branches" }]);
  }, [setBreadcrumbs]);

  const factoryBrancheForm = useForm<z.infer<typeof FACTORY_BRANCHE_SCHEMA>>({
    resolver: zodResolver(FACTORY_BRANCHE_SCHEMA),
    defaultValues: {
      factoryConditionSetId: "",
      factoryConditionSetInvert: false,
      description: "",
      active: false,
    },
  });

  async function fetchFactoryBranches(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactoryBranches({ pagination, filters: _filters });
    } catch (error) {
      toast.error("An error occurred while factory branches: " + error);
      throw new Error("An error occurred while factory branches: " + error);
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_BRANCHE_SCHEMA>
  ) => {
    console.log(formValues);
    // await createLink(formValues);
    toast.success("Link created successfully!");
  };

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.factory,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.nextFactory,
        colDefs.description,
      ]}
      fetcher={fetchFactoryBranches}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.nextFactory,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      dialogForm={factoryBrancheForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <FactoryBrancheFormFields control={factoryBrancheForm.control} />
      )}
    />
  );
}
