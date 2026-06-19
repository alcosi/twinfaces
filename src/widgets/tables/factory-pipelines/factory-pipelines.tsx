"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check, EllipsisVertical, FolderUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FactoryPipelineFilterKeys,
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
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import {
  FactoryPipelineExportSqlDialog,
  FactoryPipelineExportSqlDialogRef,
} from "./factory-pipeline-export-sql-dialog";
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
  outputTwinStatusId,
  title,
}: {
  factoryId?: string;
  outputTwinStatusId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchFactoryPipelines } = useFactoryPipelineSearch();
  const { createFactoryPipeline } = useFactoryPipelineCreate();
  const exportSqlDialogRef = useRef<FactoryPipelineExportSqlDialogRef>(null);

  const actionsCol: ColumnDef<FactoryPipeline_DETAILED> = {
    id: "actions",
    header: "Actions",
    cell: ({ row: { original } }) => (
      <div
        className="flex justify-end"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="iconS6"
              onClick={(event) => event.stopPropagation()}
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                exportSqlDialogRef.current?.open(
                  original as FactoryPipeline_DETAILED
                );
              }}
              className="cursor-pointer"
            >
              <FolderUp className="mr-2 h-4 w-4" />
              Export sql
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  // When the table is scoped to an entity, the filter for that entity is
  // dropped (it is fixed by the scope): a factory scope hides the factory
  // filter, an output-status scope hides the output-status filter.
  const enabledFilters: FactoryPipelineFilterKeys[] | undefined = isTruthy(
    factoryId
  )
    ? [
        "idList",
        "inputTwinClassIdList",
        "factoryConditionSetIdList",
        "active",
        "outputTwinStatusIdList",
        "nextFactoryIdList",
        "descriptionLikeList",
      ]
    : isTruthy(outputTwinStatusId)
      ? [
          "idList",
          "factoryIdList",
          "inputTwinClassIdList",
          "factoryConditionSetIdList",
          "active",
          "nextFactoryIdList",
          "descriptionLikeList",
        ]
      : undefined;

  const { buildFilterFields, mapFiltersToPayload } = useFactoryPipelineFilters({
    enabledFilters,
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
        outputStatusId: outputTwinStatusId || "",
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
          outputTwinStatusIdList: outputTwinStatusId
            ? toArrayOfString(toArray(outputTwinStatusId), "id")
            : _filters.outputTwinStatusIdList,
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
    <>
      <CrudDataTable
        permissionSegment="pipelines"
        title={title}
        columns={[
          colDefs.id,
          ...(isFalsy(factoryId) ? [colDefs.factory] : []),
          colDefs.inputTwinClassId,
          colDefs.factoryConditionSet,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          ...(isFalsy(outputTwinStatusId) ? [colDefs.outputTwinStatus] : []),
          colDefs.nextFactory,
          colDefs.description,
          actionsCol,
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
          ...(isFalsy(outputTwinStatusId) ? [colDefs.outputTwinStatus] : []),
          colDefs.nextFactory,
          colDefs.description,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        dialogForm={factoryPipelinesForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <FactoryPipelineFormFields control={factoryPipelinesForm.control} />
        )}
      />

      <FactoryPipelineExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
