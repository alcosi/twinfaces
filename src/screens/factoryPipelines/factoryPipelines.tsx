"use client";

import { Factory } from "@/entities/factory";
import { FactoryResourceLink } from "@/entities/factory/components/resource-link/resource-link";
import {
  FactoryPipeline, FactoryPipeline_DETAILED,
  useFactoryPipelineFilters,
  useFactoryPipelineSearch,
} from "@/entities/factoryPipeline";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { TwinClassStatusResourceLink, TwinStatus } from "@/entities/twinStatus";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Omit<
    FactoryPipeline,
    | "inputTwinClassId"
    | "factoryId"
    | "factoryConditionSetId"
    | "nextFactoryId"
    | "outputTwinStatusId"
      // | "inputTwinClass"
  >,
  ColumnDef<FactoryPipeline_DETAILED>
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
  inputTwinClass: {
    id: "inputTwinClassId",
    accessorKey: "inputTwinClassId",
    header: "Input Twin Class",
    cell: ({row: {original}}) =>
        original.inputTwinClass && (
            <div className="max-w-48 inline-flex">
              <TwinClassResourceLink
                  data={original.inputTwinClass as TwinClass_DETAILED}
                  withTooltip
              />
            </div>
        ),

  },
  outputTwinStatus: {
    id: "outputTwinStatus",
    accessorKey: "outputTwinStatus",
    header: "Output Twin Status",
    cell: ({row: {original}}) =>
        original.outputTwinStatus && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.outputTwinStatus as TwinStatus}
            twinClassId={original.inputTwinClassId!}
            withTooltip
          />
        </div>
      ),
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
  nextFactoryLimitScope: {
    id: "nextFactoryLimitScope",
    accessorKey: "nextFactoryLimitScope",
    header: "Next Factory Limit Scope",
    cell: (data) => data.getValue() && <Check />,
  },
  pipelineStepsCount: {
    id: "pipelineStepsCount",
    accessorKey: "pipelineStepsCount",
    header: "Pipeline Steps",
  },
};

export function FactoryPipelines() {
  const { searchFactoryPipelines } = useFactoryPipelineSearch();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryPipelineFilters();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Pipelines", href: "/workspace/pipelines" }]);
  }, []);

  async function fetchFactoryPipelines(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);
    console.log(await searchFactoryPipelines({ pagination, filters: _filters }))
    try {
      return await searchFactoryPipelines({ pagination, filters: _filters });
    } catch (error) {
      toast.error(
        "An error occurred while fetching factory pipelines: " + error
      );
      throw new Error(
        "An error occurred while fetching factory pipelines: " + error
      );
    }
  }

  return (
    <CrudDataTable
      columns={Object.values(colDefs) as ColumnDef<FactoryPipeline_DETAILED>[]}
      fetcher={fetchFactoryPipelines}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.inputTwinClass,
        colDefs.outputTwinStatus,
        colDefs.nextFactory,
        colDefs.active,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
