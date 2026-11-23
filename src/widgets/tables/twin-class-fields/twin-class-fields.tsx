"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Copy, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Featurer_DETAILED } from "@/entities/featurer";
import { Permission_DETAILED } from "@/entities/permission";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import {
  TwinClassFieldCountGroup,
  TwinClassFieldCountGroupField,
  TwinClassFieldV1_DETAILED,
  TwinClassFieldV2FilterKeys,
  TwinClassFieldV2Filters,
  useTwinClassFieldCount,
  useTwinClassFieldCreate,
  useTwinClassFieldFilters,
  useTwinClassFieldSearch,
} from "@/entities/twin-class-field";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy, reduceToObject, toArray } from "@/shared/libs";
import {
  BooleanIndicator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
  buildCountGroupings,
  narrowBy,
} from "../../crud-data-table";
import { TWIN_CLASS_FIELD_SCHEMA } from "./constants";
import { TwinClassFieldFormFields } from "./form-fields";
import { buildTwinClassFieldCreateRq } from "./helpers";
import {
  TwinClassFieldDuplicateDialog,
  TwinClassFieldDuplicateDialogRef,
} from "./twin-class-field-duplicate-dialog";
import { TwinClassFieldFormValues } from "./types";

const colDefs: Record<
  keyof Pick<
    TwinClassFieldV1_DETAILED,
    | "id"
    | "twinClassId"
    | "key"
    | "name"
    | "order"
    | "description"
    | "fieldTyperFeaturerId"
    | "twinSorterFeaturerId"
    | "viewPermissionId"
    | "editPermissionId"
    | "required"
    | "system"
    | "inheritable"
    | "externalId"
    | "dependent"
    | "hasDependentFields"
    | "projectionField"
    | "hasProjectedFields"
    | "fieldInitializerFeaturerId"
  >,
  ColumnDef<TwinClassFieldV1_DETAILED>
> = {
  id: {
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: () => <SortableHeader title="Class" sortField="twinClassName" />,
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink data={original.twinClass} withTooltip />
        </div>
      ),
  },

  key: {
    accessorKey: "key",
    header: () => <SortableHeader title="Key" sortField="key" />,
  },

  name: {
    accessorKey: "name",
    header: () => <SortableHeader title="Name" sortField="name" />,
  },

  order: {
    accessorKey: "order",
    header: () => <SortableHeader title="Order" sortField="order" />,
  },

  description: {
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

  fieldTyperFeaturerId: {
    accessorKey: "fieldTyperFeaturerId",
    header: () => (
      <SortableHeader title="Field typer" sortField="fieldTyperFeaturerName" />
    ),
    cell: ({ row: { original } }) =>
      original.fieldTyperFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.fieldTyperFeaturer}
            params={original.fieldTyperDetailedParams}
            withTooltip
          />
        </div>
      ),
  },

  twinSorterFeaturerId: {
    accessorKey: "twinSorterFeaturerId",
    header: () => (
      <SortableHeader title="Twin sorter" sortField="twinSorterFeaturerName" />
    ),
    cell: ({ row: { original } }) =>
      original.twinSorterFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.twinSorterFeaturer}
            params={original.twinSorterDetailedParams}
            withTooltip
          />
        </div>
      ),
  },

  viewPermissionId: {
    accessorKey: "viewPermissionId",
    header: () => (
      <SortableHeader title="View permission" sortField="viewPermissionName" />
    ),
    cell: ({ row: { original } }) =>
      original.viewPermission && (
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink data={original.viewPermission} withTooltip />
        </div>
      ),
  },

  editPermissionId: {
    accessorKey: "editPermissionId",
    header: () => (
      <SortableHeader title="Edit permission" sortField="editPermissionName" />
    ),
    cell: ({ row: { original } }) =>
      original.editPermission && (
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink data={original.editPermission} withTooltip />
        </div>
      ),
  },

  required: {
    accessorKey: "required",
    header: () => <SortableHeader title="Required" sortField="required" />,
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  system: {
    accessorKey: "system",
    header: () => <SortableHeader title="System" sortField="system" />,
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  inheritable: {
    accessorKey: "inheritable",
    header: () => (
      <SortableHeader title="Inheritable" sortField="inheritable" />
    ),
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  externalId: {
    accessorKey: "externalId",
    header: () => <SortableHeader title="External id" sortField="externalId" />,
  },

  dependent: {
    accessorKey: "dependent",
    header: () => (
      <SortableHeader title="Dependent" sortField="dependentField" />
    ),
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  hasDependentFields: {
    accessorKey: "hasDependentFields",
    header: () => (
      <SortableHeader
        title="Has dependent fields"
        sortField="hasDependentFields"
      />
    ),
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  projectionField: {
    accessorKey: "projectionField",
    header: () => (
      <SortableHeader title="Projected" sortField="projectionField" />
    ),
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  hasProjectedFields: {
    accessorKey: "hasProjectedFields",
    header: () => (
      <SortableHeader
        title="Has projected fields"
        sortField="hasProjectedFields"
      />
    ),
    cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
  },

  fieldInitializerFeaturerId: {
    accessorKey: "fieldInitializerFeaturerId",
    header: () => (
      <SortableHeader
        title="Field initializer"
        sortField="fieldInitializerFeaturerName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.fieldInitializerFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.fieldInitializerFeaturer}
            params={original.fieldInitializerDetailedParams}
            withTooltip
          />
        </div>
      ),
  },
};

/** Renders a tri-state boolean group label, leaving unset groups to fall back. */
function boolLabel(
  value: boolean | undefined,
  yes: string,
  no: string
): string | undefined {
  return value == null ? undefined : value ? yes : no;
}

export function TwinClassFieldsTable({
  twinClassId,
}: {
  twinClassId?: string;
}) {
  const tableRef = useRef<DataTableHandle>(null);
  const duplicateDialogRef = useRef<TwinClassFieldDuplicateDialogRef>(null);
  const router = useRouter();
  const { createTwinClassField } = useTwinClassFieldCreate();
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFieldFilters({
    enabledFilters: isTruthy(twinClassId)
      ? [
          "idList",
          "keyLikeList",
          "nameI18nLikeList",
          "descriptionI18nLikeList",
          "fieldTyperIdList",
          "twinSorterIdList",
          "viewPermissionIdList",
          "editPermissionIdList",
          "required",
          "system",
          "dependentField",
          "hasDependentFields",
          "projectionField",
          "hasProjectionFields",
        ]
      : undefined,
  });
  const { searchByFilters } = useTwinClassFieldSearch();
  const { countTwinClassField } = useTwinClassFieldCount();

  // Maps the table filter values to the search payload, scoped to the
  // (optional) twin class. Shared by the table fetcher and the server-side
  // breakdowns so both honour the active filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<string, unknown>): TwinClassFieldV2Filters => {
      const mapped = mapFiltersToPayload(
        rawFilters as Record<TwinClassFieldV2FilterKeys, unknown>
      );
      return {
        ...mapped,
        twinClassIdMap: twinClassId
          ? reduceToObject({ list: toArray(twinClassId), defaultValue: true })
          : mapped.twinClassIdMap,
      };
    },
    [mapFiltersToPayload, twinClassId]
  );

  async function fetchFields(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<TwinClassFieldV1_DETAILED>> {
    try {
      const response = await searchByFilters({
        pagination,
        filters: resolveFilters(filters.filters),
        sort,
      });

      return {
        data: response.data ?? [],
        pagination: response.pagination ?? {},
      };
    } catch {
      toast.error("Failed to fetch fields");
      return { data: [], pagination: {} };
    }
  }

  // Server-side breakdowns backed by /private/twin_class_fields/count/v1,
  // bound to the active filters and the (optional) scoping twin class: the pie
  // charts, and the grouping of the table view, whose groups open through the
  // matching search filters.
  const { chartGroupings, grouping } = useMemo(
    () =>
      buildCountGroupings<
        TwinClassFieldV1_DETAILED,
        TwinClassFieldCountGroup,
        TwinClassFieldV2Filters
      >({
        fields: [
          {
            key: "twinClass",
            label: "Class",
            groupField: "twinClassId",
            getValue: (g) => g.twinClassId,
            getText: (g) => g.twinClass?.name,
            renderLabel: (g) =>
              g.twinClass && (
                <TwinClassResourceLink
                  data={g.twinClass as TwinClass_DETAILED}
                  withTooltip
                />
              ),
            narrow: narrowBy.idMap<TwinClassFieldV2Filters>("twinClassIdMap"),
          },
          {
            key: "fieldTyper",
            label: "Field typer",
            groupField: "fieldTyperFeaturerId",
            getValue: (g) =>
              g.fieldTyperFeaturerId != null
                ? String(g.fieldTyperFeaturerId)
                : undefined,
            getText: (g) => g.fieldTyperFeaturer?.name,
            renderLabel: (g) =>
              g.fieldTyperFeaturer && (
                <FeaturerResourceLink
                  data={g.fieldTyperFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              ),
            narrow:
              narrowBy.numberList<TwinClassFieldV2Filters>("fieldTyperIdList"),
          },
          {
            key: "twinSorter",
            label: "Twin sorter",
            groupField: "twinSorterFeaturerId",
            getValue: (g) =>
              g.twinSorterFeaturerId != null
                ? String(g.twinSorterFeaturerId)
                : undefined,
            getText: (g) => g.twinSorterFeaturer?.name,
            renderLabel: (g) =>
              g.twinSorterFeaturer && (
                <FeaturerResourceLink
                  data={g.twinSorterFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              ),
            narrow:
              narrowBy.numberList<TwinClassFieldV2Filters>("twinSorterIdList"),
          },
          {
            key: "fieldInitializer",
            label: "Field initializer",
            groupField: "fieldInitializerFeaturerId",
            getValue: (g) =>
              g.fieldInitializerFeaturerId != null
                ? String(g.fieldInitializerFeaturerId)
                : undefined,
            getText: (g) => g.fieldInitializerFeaturer?.name,
            renderLabel: (g) =>
              g.fieldInitializerFeaturer && (
                <FeaturerResourceLink
                  data={g.fieldInitializerFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              ),
            narrow: narrowBy.numberList<TwinClassFieldV2Filters>(
              "fieldInitiatorIdList"
            ),
          },
          {
            key: "viewPermission",
            label: "View permission",
            groupField: "viewPermissionId",
            getValue: (g) => g.viewPermissionId,
            getText: (g) => g.viewPermission?.name,
            renderLabel: (g) =>
              g.viewPermission && (
                <PermissionResourceLink
                  data={g.viewPermission as Permission_DETAILED}
                  withTooltip
                />
              ),
            narrow: narrowBy.idList<TwinClassFieldV2Filters>(
              "viewPermissionIdList"
            ),
          },
          {
            key: "editPermission",
            label: "Edit permission",
            groupField: "editPermissionId",
            getValue: (g) => g.editPermissionId,
            getText: (g) => g.editPermission?.name,
            renderLabel: (g) =>
              g.editPermission && (
                <PermissionResourceLink
                  data={g.editPermission as Permission_DETAILED}
                  withTooltip
                />
              ),
            narrow: narrowBy.idList<TwinClassFieldV2Filters>(
              "editPermissionIdList"
            ),
          },
          {
            key: "required",
            label: "Required",
            groupField: "required",
            getValue: (g) =>
              g.required == null ? undefined : String(g.required),
            getText: (g) => boolLabel(g.required, "Required", "Not required"),
            narrow: narrowBy.ternary<TwinClassFieldV2Filters>("required"),
          },
          {
            key: "system",
            label: "System",
            groupField: "system",
            getValue: (g) => (g.system == null ? undefined : String(g.system)),
            getText: (g) => boolLabel(g.system, "System", "Not system"),
            narrow: narrowBy.ternary<TwinClassFieldV2Filters>("system"),
          },
          {
            key: "inheritable",
            label: "Inheritable",
            groupField: "inheritable",
            getValue: (g) =>
              g.inheritable == null ? undefined : String(g.inheritable),
            getText: (g) =>
              boolLabel(g.inheritable, "Inheritable", "Not inheritable"),
            narrow: narrowBy.ternary<TwinClassFieldV2Filters>("inheritable"),
          },
          {
            key: "dependentField",
            label: "Dependent",
            groupField: "dependentField",
            getValue: (g) =>
              g.dependentField == null ? undefined : String(g.dependentField),
            getText: (g) =>
              boolLabel(g.dependentField, "Dependent", "Not dependent"),
            narrow: narrowBy.ternary<TwinClassFieldV2Filters>("dependentField"),
          },
          {
            key: "hasDependentFields",
            label: "Has dependent fields",
            groupField: "hasDependentFields",
            getValue: (g) =>
              g.hasDependentFields == null
                ? undefined
                : String(g.hasDependentFields),
            getText: (g) => boolLabel(g.hasDependentFields, "Yes", "No"),
            narrow:
              narrowBy.ternary<TwinClassFieldV2Filters>("hasDependentFields"),
          },
          {
            key: "projectionField",
            label: "Projected",
            groupField: "projectionField",
            getValue: (g) =>
              g.projectionField == null ? undefined : String(g.projectionField),
            getText: (g) =>
              boolLabel(g.projectionField, "Projected", "Not projected"),
            narrow:
              narrowBy.ternary<TwinClassFieldV2Filters>("projectionField"),
          },
          {
            key: "hasProjectedFields",
            label: "Has projected fields",
            groupField: "hasProjectedFields",
            getValue: (g) =>
              g.hasProjectedFields == null
                ? undefined
                : String(g.hasProjectedFields),
            getText: (g) => boolLabel(g.hasProjectedFields, "Yes", "No"),
            narrow: narrowBy.ternary<TwinClassFieldV2Filters>(
              "hasProjectionFields"
            ),
          },
        ],
        resolveFilters: ({ filters }) => resolveFilters(filters),
        count: ({ filters, groupField, offset, limit }) =>
          countTwinClassField({
            filters,
            groupField: groupField as TwinClassFieldCountGroupField,
            offset,
            limit,
          }),
        fetchRows: async ({ filters, pagination, sort }) => {
          const response = await searchByFilters({
            pagination,
            filters,
            sort,
          });
          return {
            data: response.data ?? [],
            pagination: response.pagination ?? {},
          };
        },
      }),
    [resolveFilters, countTwinClassField, searchByFilters]
  );

  const form = useForm<TwinClassFieldFormValues>({
    resolver: zodResolver(TWIN_CLASS_FIELD_SCHEMA),
    defaultValues: {
      twinClassId: twinClassId || "",
      key: "",
      name: "",
      description: "",
      required: false,
      system: false,
      fieldTyperParams: {},
      twinSorterParams: {},
      fieldInitializerParams: {},
      viewPermissionId: "",
      editPermissionId: "",
    },
  });

  const handleOnCreateSubmit = async (formValues: TwinClassFieldFormValues) => {
    await createTwinClassField({
      body: buildTwinClassFieldCreateRq(formValues, twinClassId),
    });
    toast.success("Class field created successfully!");
  };

  const actionsCol: ColumnDef<TwinClassFieldV1_DETAILED> = {
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

  return (
    <>
      <CrudDataTable
        permissionSegment="fields"
        title="Fields"
        ref={tableRef}
        columns={[
          colDefs.id,
          colDefs.twinClassId,
          colDefs.key,
          colDefs.name,
          colDefs.order,
          colDefs.description,
          colDefs.fieldTyperFeaturerId,
          colDefs.twinSorterFeaturerId,
          colDefs.viewPermissionId,
          colDefs.editPermissionId,
          colDefs.required,
          colDefs.system,
          colDefs.inheritable,
          colDefs.externalId,
          colDefs.dependent,
          colDefs.hasDependentFields,
          colDefs.projectionField,
          colDefs.hasProjectedFields,
          colDefs.fieldInitializerFeaturerId,
          actionsCol,
        ]}
        getRowId={(row) => row.id}
        fetcher={fetchFields}
        chartGroupings={chartGroupings}
        grouping={grouping}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/fields/${row.id}`)
        }
        getRowHref={(row) => `/${PlatformArea.core}/fields/${row.id}`}
        filters={{
          filtersInfo: buildFilterFields(),
        }}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.twinClassId,
          colDefs.key,
          colDefs.name,
          colDefs.order,
          colDefs.description,
          colDefs.fieldTyperFeaturerId,
          colDefs.twinSorterFeaturerId,
          colDefs.viewPermissionId,
          colDefs.editPermissionId,
          colDefs.required,
          colDefs.system,
          colDefs.inheritable,
          colDefs.externalId,
          colDefs.dependent,
          colDefs.hasDependentFields,
          colDefs.projectionField,
          colDefs.hasProjectedFields,
          actionsCol,
        ]}
        dialogForm={form}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <TwinClassFieldFormFields control={form.control} />
        )}
      />

      <TwinClassFieldDuplicateDialog
        ref={duplicateDialogRef}
        onSuccess={() => tableRef.current?.refresh()}
      />
    </>
  );
}
