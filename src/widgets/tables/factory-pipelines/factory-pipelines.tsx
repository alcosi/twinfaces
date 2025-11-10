"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FactoryPipeline_DETAILED,
  useFactoryPipelineCreate,
  useFactoryPipelineFilters,
  useFactoryPipelineSearch,
} from "@/entities/factory-pipeline";
import { FACTORY_PIPELINE_SCHEMA } from "@/entities/factory-pipeline";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import { FactoryPipelineFormFields } from "./form-fields";

const colDefs: Record<
  keyof Omit<
    FactoryPipeline_DETAILED,
    | "factoryId"
    | "factoryConditionSetId"
    | "nextFactoryId"
    | "outputTwinStatusId"
    | "inputTwinClass"
  >,
  ColumnDef<FactoryPipeline_DETAILED>
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
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },

  inputTwinClassId: {
    id: "inputTwinClassId",
    accessorKey: "inputTwinClassId",
    header: "Input Class",
    cell: ({ row: { original } }) =>
      original.inputTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },

  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition Set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="inline-flex max-w-48">
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
    header: "Condition Invert",
    cell: (data) => data.getValue() && <Check />,
  },

  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },

  outputTwinStatus: {
    id: "outputTwinStatus",
    accessorKey: "outputTwinStatus",
    header: "Output Status",
    cell: ({ row: { original } }) =>
      original.outputTwinStatus && (
        <div className="inline-flex max-w-48">
          <TwinClassStatusResourceLink
            data={original.outputTwinStatus}
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
    cell: ({ row: { original } }) =>
      original.nextFactory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.nextFactory} withTooltip />
        </div>
      ),
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
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

export function FactoryPipelinesTable({
  factoryId,
  title,
}: {
  factoryId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchFactoryPipelines } = useFactoryPipelineSearch();
  const { createFactoryPipeline } = useFactoryPipelineCreate();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryPipelineFilters({
    enabledFilters: isTruthy(factoryId)
      ? [
          "idList",
          "inputTwinClassIdList",
          "factoryConditionSetIdList",
          "active",
          "outputTwinStatusIdList",
          "nextFactoryIdList",
          "descriptionLikeList",
        ]
      : undefined,
  });

  const factoryPipelinesForm = useForm<z.infer<typeof FACTORY_PIPELINE_SCHEMA>>(
    {
      resolver: zodResolver(FACTORY_PIPELINE_SCHEMA),
      defaultValues: {
        factoryId: factoryId || "",
        inputTwinClassId: "",
        factoryConditionSetId: "",
        factoryConditionSetInvert: false,
        active: true,
        outputStatusId: "",
        nextFactoryId: "",
        description: undefined,
      },
    }
  );

  async function fetchFactoryPipelines(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactoryPipelines({
        pagination,
        filters: {
          ..._filters,
          factoryIdList: factoryId
            ? toArrayOfString(toArray(factoryId), "id")
            : _filters.factoryIdList,
        },
      });
    } catch (error) {
      toast.error(
        "An error occurred while fetching factory pipelines: " + error
      );
      throw new Error(
        "An error occurred while fetching factory pipelines: " + error
      );
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_PIPELINE_SCHEMA>
  ) => {
    const { factoryId, ...body } = formValues;

    await createFactoryPipeline({
      id: factoryId,
      body: { factoryPipeline: body },
    });

    toast.success("Factory pipeline created successfully!");
  };

  return (
    <CrudDataTable
      title={title}
      columns={[
        colDefs.id,
        ...(isFalsy(factoryId) ? [colDefs.factory] : []),
        colDefs.inputTwinClassId,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.outputTwinStatus,
        colDefs.nextFactory,
        colDefs.description,
      ]}
      fetcher={fetchFactoryPipelines}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/pipelines/${row.id}`)
      }
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(factoryId) ? [colDefs.factory] : []),
        colDefs.inputTwinClassId,
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.outputTwinStatus,
        colDefs.nextFactory,
        colDefs.description,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      dialogForm={factoryPipelinesForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <FactoryPipelineFormFields control={factoryPipelinesForm.control} />
      )}
    />
  );
}
