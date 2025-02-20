"use client";

import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { FactoryResourceLink } from "@/entities/factory";
import { FactoryConditionSetResourceLink } from "@/entities/factory-condition-set";
import { FactoryPipelineResourceLink } from "@/entities/factory-pipeline";
import {
  PipelineStep_DETAILED,
  usePipelineStepFilters,
  usePipelineStepSearch,
} from "@/entities/factory-pipeline-step";
import { FeaturerResourceLink, Featurer_DETAILED } from "@/entities/featurer";
import { PagedResponse } from "@/shared/api";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    PipelineStep_DETAILED,
    | "id"
    | "description"
    | "factoryPipeline"
    | "factoryPipelineId"
    | "factoryConditionInvert"
    | "factoryConditionSet"
    | "active"
    | "fillerFeaturer"
    | "optional"
  >,
  ColumnDef<PipelineStep_DETAILED>
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
  factoryPipelineId: {
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
  factoryConditionInvert: {
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

export function PipelineStepsTable({ pipelineId }: { pipelineId?: string }) {
  const { searchPipelineStep } = usePipelineStepSearch();
  const router = useRouter();
  const { buildFilterFields, mapFiltersToPayload } = usePipelineStepFilters({
    enabledFilters: isTruthy(pipelineId)
      ? [
          "idList",
          "factoryIdList",
          "descriptionLikeList",
          "optional",
          "conditionInvert",
          "active",
          "fillerFeaturerIdList",
          "factoryConditionSetIdList",
        ]
      : undefined,
  });

  async function fetchPipelineStep(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<PipelineStep_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const resp = await searchPipelineStep({
        pagination,
        filters: {
          ..._filters,
          factoryPipelineIdList: pipelineId
            ? toArrayOfString(toArray(pipelineId), "id")
            : _filters.factoryPipelineIdList,
        },
      });

      return {
        data: resp.data ?? [],
        pagination: resp.pagination ?? {},
      };
    } catch (error) {
      toast.error("An error occured while fetching pipeline steps: " + error);
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.factoryPipelineId,
        ...(isFalsy(pipelineId) ? [colDefs.factoryPipeline] : []),
        colDefs.factoryConditionSet,
        colDefs.factoryConditionInvert,
        colDefs.active,
        colDefs.fillerFeaturer,
        colDefs.optional,
        colDefs.description,
      ]}
      fetcher={fetchPipelineStep}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.factoryPipelineId,
        ...(isFalsy(pipelineId) ? [colDefs.factoryPipeline] : []),
        colDefs.factoryConditionSet,
        colDefs.factoryConditionInvert,
        colDefs.fillerFeaturer,
        colDefs.active,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      onRowClick={(row) => router.push(`/workspace/pipeline-steps/${row.id}`)}
    />
  );
}
