"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Copy, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import {
  CONDITION_SET_SCHEMA,
  ConditionSetFieldValues,
  FactoryConditionSetCreateRq,
  FactoryConditionSetFilterKeys,
  FactoryConditionSet_DETAILED,
  useFactoryConditionSetCount,
  useFactoryConditionSetFilters,
  useFactoryConditionSetSearch,
} from "@/entities/factory-condition-set";
import { FactoryResourceLink } from "@/features/factory/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { formatIntlDate } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";
import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "@/widgets/crud-data-table";
import { ConditionSetFields } from "@/widgets/form-fields";

import {
  FactoryConditionSetDuplicateDialog,
  FactoryConditionSetDuplicateDialogRef,
} from "./factory-condition-set-duplicate-dialog";

const colDefs: Record<
  | "id"
  | "twinFactoryId"
  | "name"
  | "description"
  | "inFactoryPipelineUsagesCount"
  | "inFactoryPipelineStepUsagesCount"
  | "inFactoryMultiplierFilterUsagesCount"
  | "inFactoryBranchUsagesCount"
  | "inFactoryEraserUsagesCount"
  | "createdByUserId"
  | "createdAt",
  ColumnDef<FactoryConditionSet_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => {
      const value = data.getValue<string | undefined>();
      return value ? <GuidWithCopy value={value} /> : null;
    },
  },
  twinFactoryId: {
    id: "factoryId",
    accessorKey: "factoryId",
    header: () => (
      <SortableHeader title="Factory" sortField="twinFactoryName" />
    ),
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: () => <SortableHeader title="Name" sortField="name" />,
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: () => (
      <SortableHeader title="Description" sortField="description" />
    ),
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
  },
  inFactoryPipelineUsagesCount: {
    id: "inFactoryPipelineUsagesCount",
    accessorKey: "inFactoryPipelineUsagesCount",
    header: "In pipelines usages count",
  },
  inFactoryPipelineStepUsagesCount: {
    id: "inFactoryPipelineStepUsagesCount",
    accessorKey: "inFactoryPipelineStepUsagesCount",
    header: "In steps usages count",
  },
  inFactoryMultiplierFilterUsagesCount: {
    id: "inFactoryMultiplierFilterUsagesCount",
    accessorKey: "inFactoryMultiplierFilterUsagesCount",
    header: "In multiplier filters usages count",
  },
  inFactoryBranchUsagesCount: {
    id: "inFactoryBranchUsagesCount",
    accessorKey: "inFactoryBranchUsagesCount",
    header: "In branches usages count",
  },
  inFactoryEraserUsagesCount: {
    id: "inFactoryEraserUsagesCount",
    accessorKey: "inFactoryEraserUsagesCount",
    header: "In erasers usages count",
  },
  createdByUserId: {
    id: "createdByUserId",
    accessorKey: "createdByUserId",
    header: () => (
      <SortableHeader title="Created by" sortField="createdByUserName" />
    ),
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
  createdAt: {
    id: "createdBy",
    accessorKey: "createdAt",
    header: () => <SortableHeader title="Created at" sortField="createdAt" />,
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
};

export function ConditionSetsScreen() {
  const router = useRouter();
  const duplicateDialogRef =
    useRef<FactoryConditionSetDuplicateDialogRef>(null);
  const api = useContext(PrivateApiContext);
  const { searchFactoryConditionSet } = useFactoryConditionSetSearch();
  const { countFactoryConditionSets } = useFactoryConditionSetCount();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryConditionSetFilters();

  const actionsCol: ColumnDef<FactoryConditionSet_DETAILED> = {
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
                duplicateDialogRef.current?.open(original);
              }}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  async function fetchFactoryConditionSet(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<FactoryConditionSet_DETAILED>> {
    const _filters = mapFiltersToPayload(
      filters.filters as Record<FactoryConditionSetFilterKeys, unknown>
    );

    try {
      return searchFactoryConditionSet({ pagination, filters: _filters, sort });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory condition sets: " + error
      );
      throw new Error(
        "An error occured while fetching factory condition sets: " + error
      );
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/factory_condition_set/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<FactoryConditionSetFilterKeys, unknown>
      );

      return [
        {
          key: "factory",
          label: "Factory",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryConditionSets({
                filters: resolved,
                groupField: "twinFactoryId",
                offset,
                limit,
              }),
            (g) => g.twinFactoryId,
            (g) => g.factory?.name ?? g.factory?.key,
            (g) =>
              g.factory && <FactoryResourceLink data={g.factory} withTooltip />
          ),
        },
        {
          key: "createdByUser",
          label: "Created by",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryConditionSets({
                filters: resolved,
                groupField: "createdByUserId",
                offset,
                limit,
              }),
            (g) => g.createdByUserId,
            (g) => g.createdByUser?.fullName,
            (g) =>
              g.createdByUser && (
                <UserResourceLink data={g.createdByUser} withTooltip />
              )
          ),
        },
        {
          key: "cachable",
          label: "Cachable",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryConditionSets({
                filters: resolved,
                groupField: "cachable",
                offset,
                limit,
              }),
            (g) => (g.cachable === undefined ? undefined : String(g.cachable)),
            (g) =>
              g.cachable === undefined
                ? undefined
                : g.cachable
                  ? "Cachable"
                  : "Not cachable"
          ),
        },
      ];
    },
    [mapFiltersToPayload, countFactoryConditionSets]
  );

  const conditionSetForm = useForm<ConditionSetFieldValues>({
    resolver: zodResolver(CONDITION_SET_SCHEMA),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof CONDITION_SET_SCHEMA>
  ) => {
    const requestBody: FactoryConditionSetCreateRq = {
      conditionSets: [
        {
          name: formValues.name,
          twinFactoryId: formValues.twinFactoryId,
          description: formValues.description,
        },
      ],
    };

    const { error } = await api.factoryConditionSet.create({
      body: requestBody,
    });

    if (error) {
      throw error;
    }
    toast.success("Condition set created successfully!");
  };

  return (
    <>
      <CrudDataTable
        title="Condition sets"
        columns={[
          colDefs.id,
          colDefs.twinFactoryId,
          colDefs.name,
          colDefs.description,
          colDefs.inFactoryPipelineUsagesCount,
          colDefs.inFactoryPipelineStepUsagesCount,
          colDefs.inFactoryMultiplierFilterUsagesCount,
          colDefs.inFactoryBranchUsagesCount,
          colDefs.inFactoryEraserUsagesCount,
          colDefs.createdByUserId,
          colDefs.createdAt,
          actionsCol,
        ]}
        fetcher={fetchFactoryConditionSet}
        getRowId={(row) => row.id || ""}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/condition-sets/${row.id}`)
        }
        getRowHref={(row) => `/${PlatformArea.core}/condition-sets/${row.id}`}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.twinFactoryId,
          colDefs.name,
          colDefs.description,
          colDefs.inFactoryPipelineUsagesCount,
          colDefs.inFactoryPipelineStepUsagesCount,
          colDefs.inFactoryMultiplierFilterUsagesCount,
          colDefs.inFactoryBranchUsagesCount,
          colDefs.inFactoryEraserUsagesCount,
          colDefs.createdByUserId,
          colDefs.createdAt,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        chartGroupings={buildChartGroupings}
        dialogForm={conditionSetForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <ConditionSetFields control={conditionSetForm.control} />
        )}
      />

      <FactoryConditionSetDuplicateDialog ref={duplicateDialogRef} />
    </>
  );
}
