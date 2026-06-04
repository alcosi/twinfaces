import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check, Copy, EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Featurer_DETAILED } from "@/entities/featurer";
import { Permission_DETAILED } from "@/entities/permission";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import {
  TwinClassFieldCountGroup,
  TwinClassFieldCreateRq,
  TwinClassFieldV1_DETAILED,
  TwinClassFieldV2FilterKeys,
  useTwinClassFieldCount,
  useTwinClassFieldFilters,
  useTwinClassFieldSearch,
} from "@/entities/twin-class-field";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy, reduceToObject, toArray } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  PieChartDatum,
  getPieChartColor,
} from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
} from "../../crud-data-table";
import { TWIN_CLASS_FIELD_SCHEMA } from "./constants";
import { TwinClassFieldFormFields } from "./form-fields";
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
    cell: (data) => data.getValue() && <Check />,
  },

  system: {
    accessorKey: "system",
    header: () => <SortableHeader title="System" sortField="system" />,
    cell: (data) => data.getValue() && <Check />,
  },

  inheritable: {
    accessorKey: "inheritable",
    header: () => (
      <SortableHeader title="Inheritable" sortField="inheritable" />
    ),
    cell: (data) => data.getValue() && <Check />,
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
    cell: (data) => data.getValue() && <Check />,
  },

  hasDependentFields: {
    accessorKey: "hasDependentFields",
    header: () => (
      <SortableHeader
        title="Has dependent fields"
        sortField="hasDependentFields"
      />
    ),
    cell: (data) => data.getValue() && <Check />,
  },

  projectionField: {
    accessorKey: "projectionField",
    header: () => (
      <SortableHeader title="Projected" sortField="projectionField" />
    ),
    cell: (data) => data.getValue() && <Check />,
  },

  hasProjectedFields: {
    accessorKey: "hasProjectedFields",
    header: () => (
      <SortableHeader
        title="Has projected fields"
        sortField="hasProjectedFields"
      />
    ),
    cell: (data) => data.getValue() && <Check />,
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

const UNSET_GROUP_LABEL = "— Not set —";

/** Maps server-aggregated count groups into sorted, colored pie-chart slices. */
function mapCountToSlices(
  groups: TwinClassFieldCountGroup[],
  getId: (group: TwinClassFieldCountGroup) => string | undefined,
  getLabel: (group: TwinClassFieldCountGroup) => string | undefined,
  renderLabel?: (group: TwinClassFieldCountGroup) => ReactNode
): PieChartDatum[] {
  return groups
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((group, index) => ({
      label: getLabel(group) ?? getId(group) ?? UNSET_GROUP_LABEL,
      value: group.count,
      color: getPieChartColor(index),
      legendContent: renderLabel?.(group),
    }));
}

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
  const api = useContext(PrivateApiContext);
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

  async function fetchFields(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<TwinClassFieldV1_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      const response = await searchByFilters({
        pagination,
        filters: {
          ..._filters,
          twinClassIdMap: twinClassId
            ? reduceToObject({ list: toArray(twinClassId), defaultValue: true })
            : _filters.twinClassIdMap,
        },
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

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/twin_class_fields/count/v1), bound to the active filters and the
  // (optional) scoping twin class.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<TwinClassFieldV2FilterKeys, unknown>
      );
      const scopedFilters = {
        ...resolved,
        twinClassIdMap: twinClassId
          ? reduceToObject({ list: toArray(twinClassId), defaultValue: true })
          : resolved.twinClassIdMap,
      };

      return [
        {
          key: "twinClass",
          label: "Class",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "twinClassId",
              }),
              (g) => g.twinClassId,
              (g) => g.twinClass?.name,
              (g) =>
                g.twinClass && (
                  <TwinClassResourceLink
                    data={g.twinClass as TwinClass_DETAILED}
                    withTooltip
                  />
                )
            ),
        },
        {
          key: "fieldTyper",
          label: "Field typer",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "fieldTyperFeaturerId",
              }),
              (g) =>
                g.fieldTyperFeaturerId != null
                  ? String(g.fieldTyperFeaturerId)
                  : undefined,
              (g) => g.fieldTyperFeaturer?.name,
              (g) =>
                g.fieldTyperFeaturer && (
                  <FeaturerResourceLink
                    data={g.fieldTyperFeaturer as Featurer_DETAILED}
                    withTooltip
                  />
                )
            ),
        },
        {
          key: "twinSorter",
          label: "Twin sorter",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "twinSorterFeaturerId",
              }),
              (g) =>
                g.twinSorterFeaturerId != null
                  ? String(g.twinSorterFeaturerId)
                  : undefined,
              (g) => g.twinSorterFeaturer?.name,
              (g) =>
                g.twinSorterFeaturer && (
                  <FeaturerResourceLink
                    data={g.twinSorterFeaturer as Featurer_DETAILED}
                    withTooltip
                  />
                )
            ),
        },
        {
          key: "fieldInitializer",
          label: "Field initializer",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "fieldInitializerFeaturerId",
              }),
              (g) =>
                g.fieldInitializerFeaturerId != null
                  ? String(g.fieldInitializerFeaturerId)
                  : undefined,
              (g) => g.fieldInitializerFeaturer?.name,
              (g) =>
                g.fieldInitializerFeaturer && (
                  <FeaturerResourceLink
                    data={g.fieldInitializerFeaturer as Featurer_DETAILED}
                    withTooltip
                  />
                )
            ),
        },
        {
          key: "viewPermission",
          label: "View permission",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "viewPermissionId",
              }),
              (g) => g.viewPermissionId,
              (g) => g.viewPermission?.name,
              (g) =>
                g.viewPermission && (
                  <PermissionResourceLink
                    data={g.viewPermission as Permission_DETAILED}
                    withTooltip
                  />
                )
            ),
        },
        {
          key: "editPermission",
          label: "Edit permission",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "editPermissionId",
              }),
              (g) => g.editPermissionId,
              (g) => g.editPermission?.name,
              (g) =>
                g.editPermission && (
                  <PermissionResourceLink
                    data={g.editPermission as Permission_DETAILED}
                    withTooltip
                  />
                )
            ),
        },
        {
          key: "required",
          label: "Required",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "required",
              }),
              (g) => boolLabel(g.required, "Required", "Not required"),
              (g) => boolLabel(g.required, "Required", "Not required")
            ),
        },
        {
          key: "system",
          label: "System",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "system",
              }),
              (g) => boolLabel(g.system, "System", "Not system"),
              (g) => boolLabel(g.system, "System", "Not system")
            ),
        },
        {
          key: "inheritable",
          label: "Inheritable",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "inheritable",
              }),
              (g) => boolLabel(g.inheritable, "Inheritable", "Not inheritable"),
              (g) => boolLabel(g.inheritable, "Inheritable", "Not inheritable")
            ),
        },
        {
          key: "dependentField",
          label: "Dependent",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "dependentField",
              }),
              (g) => boolLabel(g.dependentField, "Dependent", "Not dependent"),
              (g) => boolLabel(g.dependentField, "Dependent", "Not dependent")
            ),
        },
        {
          key: "hasDependentFields",
          label: "Has dependent fields",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "hasDependentFields",
              }),
              (g) => boolLabel(g.hasDependentFields, "Yes", "No"),
              (g) => boolLabel(g.hasDependentFields, "Yes", "No")
            ),
        },
        {
          key: "projectionField",
          label: "Projected",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "projectionField",
              }),
              (g) => boolLabel(g.projectionField, "Projected", "Not projected"),
              (g) => boolLabel(g.projectionField, "Projected", "Not projected")
            ),
        },
        {
          key: "hasProjectedFields",
          label: "Has projected fields",
          load: async () =>
            mapCountToSlices(
              await countTwinClassField({
                filters: scopedFilters,
                groupField: "hasProjectedFields",
              }),
              (g) => boolLabel(g.hasProjectedFields, "Yes", "No"),
              (g) => boolLabel(g.hasProjectedFields, "Yes", "No")
            ),
        },
      ];
    },
    [countTwinClassField, mapFiltersToPayload, twinClassId]
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
    const body: TwinClassFieldCreateRq = {
      twinClassFields: [
        {
          twinClassId: twinClassId || formValues.twinClassId!,
          key: formValues.key,
          required: formValues.required,
          system: formValues.system,
          nameI18n: {
            translationInCurrentLocale: formValues.name,
          },
          descriptionI18n: {
            translationInCurrentLocale: formValues.description,
          },
          fieldTyperFeaturerId: formValues.fieldTyperFeaturerId,
          fieldTyperParams: formValues.fieldTyperParams,
          twinSorterFeaturerId: formValues.twinSorterFeaturerId,
          twinSorterParams: formValues.twinSorterParams,
          viewPermissionId: formValues.viewPermissionId,
          editPermissionId: formValues.editPermissionId,
          externalId: formValues.externalId,
          fieldInitializerFeaturerId: Number(
            formValues.fieldInitializerFeaturerId
          ),
          fieldInitializerParams: formValues.fieldInitializerParams,
        },
      ],
    };

    const { error } = await api.twinClassField.create({
      body,
    });
    if (error) {
      throw error;
    }
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
        chartGroupings={buildChartGroupings}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/fields/${row.id}`)
        }
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
