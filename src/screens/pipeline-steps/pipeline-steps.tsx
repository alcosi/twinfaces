"use client";

import { FactoryResourceLink } from "@/entities/factory";
import { FactoryConditionSetResourceLink } from "@/entities/factory-condition-set";
import { FactoryPipelineResourceLink } from "@/entities/factory-pipeline";
import { Featurer_DETAILED, FeaturerResourceLink } from "@/entities/featurer";
import {
  PipelineStep,
  usePipelineStepFilters,
  usePipelineStepSearch,
} from "@/entities/factory-pipeline-step";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const colDefs: Record<
  | "id"
  | "description"
  | "factory"
  | "factoryPipeline"
  | "factoryConditionSetInvert"
  | "factoryConditionSet"
  | "active"
  | "fillerFeaturer"
  | "optional",
  ColumnDef<PipelineStep>
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
    cell: ({ row: { original } }) =>
      original.factoryPipeline?.factory && (
        <div className="max-w-48 inline-flex">
          <FactoryResourceLink
            data={original.factoryPipeline?.factory}
            withTooltip
          />
        </div>
      ),
  },
  factoryPipeline: {
    id: "factoryPipeline",
    accessorKey: "factoryPipeline",
    header: "Pipeline",
    cell: ({ row: { original } }) =>
      original.factoryPipeline && (
        <div className="max-w-48 inline-flex">
          <FactoryPipelineResourceLink
            data={original.factoryPipeline}
            withTooltip
          />
        </div>
      ),
  },
  factoryConditionSetInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: "Condition invert",
    cell: (data) => data.row.original.factoryConditionInvert && <Check />,
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition Set",
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
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
  fillerFeaturer: {
    id: "fillerFeaturer",
    accessorKey: "fillerFeaturer",
    header: "Filler featurer",
    cell: ({ row: { original } }) =>
      original.fillerFeaturer && (
        <div className="max-w-48 inline-flex">
          <FeaturerResourceLink
            data={original.fillerFeaturer as Featurer_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  optional: {
    id: "optional",
    accessorKey: "optional",
    header: "Optional",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function PipelineStepsScreen() {
  const { searchPipelineStep } = usePipelineStepSearch();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { buildFilterFields, mapFiltersToPayload } = usePipelineStepFilters();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Pipeline Steps", href: "/workspace/pipeline-steps" },
    ]);
  }, [setBreadcrumbs]);

  async function fetchPipelineStep(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return searchPipelineStep({ pagination, filters: _filters });
    } catch (error) {
      toast.error("An error occured while fetching pipeline steps: " + error);
      throw new Error(
        "An error occured while fetching pipeline steps: " + error
      );
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.factory,
        colDefs.factoryPipeline,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.fillerFeaturer,
        colDefs.optional,
        colDefs.description,
      ]}
      fetcher={fetchPipelineStep}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factory,
        colDefs.factoryPipeline,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.fillerFeaturer,
        colDefs.active,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
