"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check, Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Factory } from "@/entities/factory";
import {
  FACTORY_BRANCH_SCHEMA,
  FactoryBranch,
  FactoryBranchFilterKeys,
  FactoryBranch_DETAILED,
  useFactoryBranchCount,
  useFactoryBranchCreate,
  useFactoryBranchFilters,
  useFactoryBranchesSearch,
} from "@/entities/factory-branch";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
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

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";
import {
  FactoryBranchDuplicateDialog,
  FactoryBranchDuplicateDialogRef,
} from "./factory-branch-duplicate-dialog";
import {
  FactoryBranchExportSqlDialog,
  FactoryBranchExportSqlDialogRef,
} from "./factory-branch-export-sql-dialog";
import { FactoryBranchFormFields } from "./form-fields";

const colDefs: Record<
  keyof Omit<
    FactoryBranch,
    "factoryId" | "factoryConditionSetId" | "nextFactoryId"
  >,
  ColumnDef<FactoryBranch>
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
    header: () => <SortableHeader title="Factory" sortField="factoryName" />,
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: () => (
      <SortableHeader title="Condition set" sortField="factoryConditionName" />
    ),
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
    header: () => (
      <SortableHeader
        title="Condition invert"
        sortField="factoryConditionSetInvert"
      />
    ),
    cell: (data) => data.getValue() && <Check />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: () => <SortableHeader title="Active" sortField="active" />,
    cell: (data) => data.getValue() && <Check />,
  },
  nextFactory: {
    id: "nextFactory",
    accessorKey: "nextFactory",
    header: () => (
      <SortableHeader title="Next Factory" sortField="nextFactoryName" />
    ),
    cell: ({ row: { original } }) =>
      original.nextFactory && (
        <div className="inline-flex max-w-48">
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
};

export function FactoryBranchesTable({
  factoryId,
  title,
}: {
  factoryId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchFactoryBranches } = useFactoryBranchesSearch();
  const { countFactoryBranches } = useFactoryBranchCount();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryBranchFilters({
    enabledFilters: isTruthy(factoryId)
      ? [
          "idList",
          "factoryConditionSetIdList",
          "conditionInvert",
          "active",
          "nextFactoryIdList",
          "descriptionLikeList",
        ]
      : undefined,
  });
  const { createFactoryBranch } = useFactoryBranchCreate();
  const duplicateDialogRef = useRef<FactoryBranchDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryBranchExportSqlDialogRef>(null);

  const actionsCol: ColumnDef<FactoryBranch> = {
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
                duplicateDialogRef.current?.open(
                  original as FactoryBranch_DETAILED
                );
              }}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                exportSqlDialogRef.current?.open(
                  original as FactoryBranch_DETAILED
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

  const factoryBranchForm = useForm<z.infer<typeof FACTORY_BRANCH_SCHEMA>>({
    resolver: zodResolver(FACTORY_BRANCH_SCHEMA),
    defaultValues: {
      factoryId: factoryId || "",
      factoryConditionSetId: "",
      factoryConditionSetInvert: false,
      description: undefined,
      active: true,
      nextFactoryId: "",
    },
  });

  // Maps the table filter values to the API payload and injects the
  // contextual factory constraint. Shared by the table fetcher and the
  // pie-chart count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<FactoryBranchFilterKeys, unknown>) => {
      const mapped = mapFiltersToPayload(rawFilters);
      return {
        ...mapped,
        factoryIdList: factoryId
          ? toArrayOfString(toArray(factoryId), "id")
          : mapped.factoryIdList,
      };
    },
    [mapFiltersToPayload, factoryId]
  );

  async function fetchFactoryBranches(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<FactoryBranch_DETAILED>> {
    try {
      return await searchFactoryBranches({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<FactoryBranchFilterKeys, unknown>
        ),
        sort,
      });
    } catch (error) {
      toast.error("An error occurred while factory branches: " + error);
      throw new Error("An error occurred while factory branches: " + error);
    }
  }

  const showFactoryColumn = isFalsy(factoryId);

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/factory_branch/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(
        filters as Record<FactoryBranchFilterKeys, unknown>
      );
      const groupings: ChartGrouping[] = [];

      if (showFactoryColumn) {
        groupings.push({
          key: "factory",
          label: "Factory",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countFactoryBranches({
                filters: resolved,
                groupField: "factoryId",
                offset,
                limit,
              }),
            (g) => g.factoryId,
            (g) => g.factory?.name ?? g.factory?.key,
            (g) =>
              g.factory && <FactoryResourceLink data={g.factory} withTooltip />
          ),
        });
      }

      groupings.push({
        key: "factoryConditionSet",
        label: "Condition set",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryBranches({
              filters: resolved,
              groupField: "factoryConditionSetId",
              offset,
              limit,
            }),
          (g) => g.factoryConditionSetId,
          (g) => g.factoryConditionSet?.name,
          (g) =>
            g.factoryConditionSet && (
              <FactoryConditionSetResourceLink
                data={g.factoryConditionSet}
                withTooltip
              />
            )
        ),
      });

      groupings.push({
        key: "nextFactory",
        label: "Next Factory",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryBranches({
              filters: resolved,
              groupField: "nextFactoryId",
              offset,
              limit,
            }),
          (g) => g.nextFactoryId,
          (g) => g.nextFactory?.name ?? g.nextFactory?.key,
          (g) =>
            g.nextFactory && (
              <FactoryResourceLink
                data={g.nextFactory as Factory}
                withTooltip
              />
            )
        ),
      });

      groupings.push({
        key: "active",
        label: "Active",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryBranches({
              filters: resolved,
              groupField: "active",
              offset,
              limit,
            }),
          (g) => (g.active === undefined ? undefined : String(g.active)),
          (g) =>
            g.active === undefined
              ? undefined
              : g.active
                ? "Active"
                : "Inactive"
        ),
      });

      groupings.push({
        key: "factoryConditionSetInvert",
        label: "Condition invert",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countFactoryBranches({
              filters: resolved,
              groupField: "factoryConditionSetInvert",
              offset,
              limit,
            }),
          (g) =>
            g.factoryConditionSetInvert === undefined
              ? undefined
              : String(g.factoryConditionSetInvert),
          (g) =>
            g.factoryConditionSetInvert === undefined
              ? undefined
              : g.factoryConditionSetInvert
                ? "Inverted"
                : "Not inverted"
        ),
      });

      return groupings;
    },
    [resolveFilters, countFactoryBranches, showFactoryColumn]
  );

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_BRANCH_SCHEMA>
  ) => {
    const { factoryId, ...body } = formValues;

    await createFactoryBranch({ id: factoryId, body });
    toast.success("Factory branch created successfully!");
  };

  return (
    <>
      <CrudDataTable
        permissionSegment="branches"
        columns={[
          colDefs.id,
          ...(isFalsy(factoryId) ? [colDefs.factory] : []),
          colDefs.factoryConditionSet,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          colDefs.nextFactory,
          colDefs.description,
          actionsCol,
        ]}
        fetcher={fetchFactoryBranches}
        getRowId={(row) => row.id!}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/branches/${row.id}`)
        }
        defaultVisibleColumns={[
          colDefs.id,
          ...(isFalsy(factoryId) ? [colDefs.factory] : []),
          colDefs.factoryConditionSet,
          colDefs.factoryConditionSetInvert,
          colDefs.active,
          colDefs.nextFactory,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        chartGroupings={buildChartGroupings}
        dialogForm={factoryBranchForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <FactoryBranchFormFields control={factoryBranchForm.control} />
        )}
        title={title}
      />

      <FactoryBranchDuplicateDialog ref={duplicateDialogRef} />
      <FactoryBranchExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
