"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { FactoryResourceLink } from "@/entities/factory";
import {
  FACTORY_MULTIPLIER_SCHEMA,
  FactoryMultiplier_DETAILED,
  useFactoryMultiplierCreate,
  useFactoryMultiplierFilters,
  useFactoryMultipliersSearch,
} from "@/entities/factory-multiplier";
import { FeaturerResourceLink, Featurer_DETAILED } from "@/entities/featurer";
import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

import { FactoryMultiplierFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    FactoryMultiplier_DETAILED,
    | "id"
    | "factory"
    | "inputTwinClass"
    | "active"
    | "factoryMultiplierFiltersCount"
    | "description"
    | "multiplierFeaturer"
  >,
  ColumnDef<FactoryMultiplier_DETAILED>
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
  inputTwinClass: {
    id: "inputTwinClass",
    accessorKey: "inputTwinClass",
    header: "Input class",
    cell: ({ row: { original } }) =>
      original.inputTwinClass && (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  multiplierFeaturer: {
    id: "multiplierFeaturer",
    accessorKey: "multiplierFeaturer",
    header: "Muliplier featurer",
    cell: ({ row: { original } }) =>
      original.multiplierFeaturer && (
        <div className="max-w-48 inline-flex">
          <FeaturerResourceLink
            data={original.multiplierFeaturer as Featurer_DETAILED}
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
  factoryMultiplierFiltersCount: {
    id: "factoryMultiplierFiltersCount",
    accessorKey: "factoryMultiplierFiltersCount",
    header: "Filters count",
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
};

export function FactoryMultipliersScreen() {
  const { searchFactoryMultipliers } = useFactoryMultipliersSearch();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryMultiplierFilters();
  const router = useRouter();
  const { createFactoryMultiplier } = useFactoryMultiplierCreate();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Multipliers", href: `/${PlatformArea.core}/multipliers` },
    ]);
  }, [setBreadcrumbs]);

  const factoryMultiplierForm = useForm<
    z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>
  >({
    resolver: zodResolver(FACTORY_MULTIPLIER_SCHEMA),
    defaultValues: {
      factoryId: "",
      inputTwinClassId: "",
      active: false,
      description: undefined,
    },
  });

  async function fetchFactoryMultipliers(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactoryMultipliers({ pagination, filters: _filters });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory multipliers: " + error
      );
      throw new Error("An error occured while factory multipliers: " + error);
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_MULTIPLIER_SCHEMA>
  ) => {
    const { factoryId, ...body } = formValues;

    await createFactoryMultiplier({
      id: factoryId,
      body: { factoryMultiplier: body },
    });
    toast.success("Factory multiplier created successfully!");
  };

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.factory,
        colDefs.inputTwinClass,
        colDefs.multiplierFeaturer,
        colDefs.active,
        colDefs.factoryMultiplierFiltersCount,
        colDefs.description,
      ]}
      fetcher={fetchFactoryMultipliers}
      getRowId={(row) => row.id}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.inputTwinClass,
        colDefs.multiplierFeaturer,
        colDefs.active,
        colDefs.factoryMultiplierFiltersCount,
        colDefs.description,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      onRowClick={(row) => {
        router.push(`/${PlatformArea.core}/multipliers/${row.id}`);
      }}
      dialogForm={factoryMultiplierForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <FactoryMultiplierFormFields control={factoryMultiplierForm.control} />
      )}
    />
  );
}
