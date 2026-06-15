"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check, Copy, EllipsisVertical, FolderUp, Unplug } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DataList } from "@/entities/datalist";
import { Featurer_DETAILED } from "@/entities/featurer";
import { Permission_DETAILED } from "@/entities/permission";
import {
  FetchTreePageParams,
  FetchTreePageResult,
  TWIN_CLASSES_SCHEMA,
  TwinClassContext,
  TwinClassCreateRq,
  TwinClassFieldValues,
  TwinClassFilterKeys,
  TwinClassFiltersHierarchyOverride,
  TwinClass_DETAILED,
  useTwinClassCount,
  useTwinClassFilters,
  useTwinClassSearch,
} from "@/entities/twin-class";
import { DatalistResourceLink } from "@/features/datalist/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassFreezeResourceLink } from "@/features/twin-class-freeze/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { ImageWithFallback } from "@/features/ui/image-with-fallback";
import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { cn } from "@/shared/libs";
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
  DataTableHandle,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "@/widgets/crud-data-table";

import { TwinClassFormFields } from "./form-fields";
import {
  TwinClassDuplicateDialog,
  TwinClassDuplicateDialogRef,
} from "./twin-class-duplicate-dialog";
import {
  TwinClassExportSqlDialog,
  TwinClassExportSqlDialogRef,
} from "./twin-class-export-sql-dialog";
import { TwinClassesExtendsTreeView, TwinClassesHeadTreeView } from "./view";

function ThemeIconCell({ data }: { data: TwinClass_DETAILED }) {
  const { resolvedTheme } = useTheme();

  const themeIcon =
    resolvedTheme === "light"
      ? data.iconLight
      : resolvedTheme === "dark"
        ? data.iconDark
        : undefined;

  return (
    <ImageWithFallback
      src={themeIcon as string}
      alt={themeIcon as string}
      fallbackContent={<Unplug />}
      width={32}
      height={32}
      className="text-[0]"
    />
  );
}

const colDefs: Record<
  keyof Pick<
    TwinClass_DETAILED,
    | "iconLight"
    | "id"
    | "key"
    | "name"
    | "headClassId"
    | "extendsClassId"
    | "abstractClass"
    | "assigneeRequired"
    | "permissionSchemaSpace"
    | "twinflowSchemaSpace"
    | "twinClassSchemaSpace"
    | "description"
    | "aliasSpace"
    | "markersDataListId"
    | "tagsDataListId"
    | "viewPermissionId"
    | "createPermissionId"
    | "ownerType"
    | "externalId"
    | "segment"
    | "hasSegment"
    | "twinClassFreezeId"
    | "uniqueName"
    | "twinCounter"
  >,
  ColumnDef<TwinClass_DETAILED>
> = {
  iconLight: {
    id: "logo",
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row: { original } }) => <ThemeIconCell data={original} />,
  },
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.row.original.id} />,
  },
  key: {
    id: "key",
    accessorKey: "key",
    header: () => <SortableHeader title="Key" sortField="key" />,
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
  headClassId: {
    id: "headClassId",
    accessorKey: "headClassId",
    header: () => <SortableHeader title="Head" sortField="headTwinClassName" />,
    cell: ({ row: { original } }) =>
      original.headClass ? (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.headClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ) : null,
  },
  extendsClassId: {
    id: "extendsClass.id",
    accessorKey: "extendsClass.id",
    header: () => (
      <SortableHeader title="Extends" sortField="extendsTwinClassName" />
    ),
    cell: ({ row: { original } }) =>
      original.extendsClass ? (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.extendsClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ) : null,
  },
  abstractClass: {
    id: "abstractClass",
    accessorKey: "abstractClass",
    header: () => <SortableHeader title="Abstract" sortField="abstractt" />,
    cell: (data) => data.getValue() && <Check />,
  },

  assigneeRequired: {
    id: "assigneeRequired",
    accessorKey: "assigneeRequired",
    header: () => (
      <SortableHeader title="Assignee required" sortField="assigneeRequired" />
    ),
    cell: (data) => data.getValue() && <Check />,
  },

  ownerType: {
    id: "ownerType",
    accessorKey: "ownerType",
    header: () => <SortableHeader title="Owner type" sortField="ownerType" />,
  },
  permissionSchemaSpace: {
    id: "permissionSchemaSpace",
    accessorKey: "permissionSchemaSpace",
    header: "Permission Schema",
    cell: (data) => data.getValue() && <Check />,
  },
  twinflowSchemaSpace: {
    id: "twinflowSchemaSpace",
    accessorKey: "twinflowSchemaSpace",
    header: () => (
      <SortableHeader title="Twinflow schema" sortField="twinflowSchemaSpace" />
    ),
    cell: (data) => data.getValue() && <Check />,
  },
  twinClassSchemaSpace: {
    id: "twinClassSchemaSpace",
    accessorKey: "twinClassSchemaSpace",
    header: () => (
      <SortableHeader
        title="Twinclass schema"
        sortField="twinClassSchemaSpace"
      />
    ),
    cell: (data) => data.getValue() && <Check />,
  },
  aliasSpace: {
    id: "aliasSpace",
    accessorKey: "aliasSpace",
    header: () => <SortableHeader title="Alias space" sortField="aliasSpace" />,
    cell: (data) => data.getValue() && <Check />,
  },
  markersDataListId: {
    id: "markersDataListId",
    accessorKey: "markersDataListId",
    header: () => (
      <SortableHeader title="Markers list" sortField="markerDataListName" />
    ),
    cell: ({ row: { original } }) =>
      original.markerMap ? (
        <div className="inline-flex max-w-48">
          <DatalistResourceLink data={original.markerMap} withTooltip />
        </div>
      ) : null,
  },
  tagsDataListId: {
    id: "tagsDataListId",
    accessorKey: "tagsDataListId",
    header: () => (
      <SortableHeader title="Tags list" sortField="tagDataListName" />
    ),
    cell: ({ row: { original } }) =>
      original.tagMap ? (
        <div className="inline-flex max-w-48">
          <DatalistResourceLink data={original.tagMap} withTooltip />
        </div>
      ) : null,
  },
  viewPermissionId: {
    id: "viewPermissionId",
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
  createPermissionId: {
    id: "createPermissionId",
    accessorKey: "createPermissionId",
    header: "Create permission",
    cell: ({ row: { original } }) =>
      original.createPermission && (
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink
            data={original.createPermission}
            withTooltip
          />
        </div>
      ),
  },

  externalId: {
    id: "externalId",
    accessorKey: "externalId",
    header: () => <SortableHeader title="External Id" sortField="externalId" />,
  },

  segment: {
    id: "segment",
    accessorKey: "segment",
    header: () => <SortableHeader title="Segment" sortField="segment" />,
    cell: (data) => data.getValue() && <Check />,
  },

  hasSegment: {
    id: "hasSegment",
    accessorKey: "hasSegment",
    header: "Has segment",
    cell: (data) => data.getValue() && <Check />,
  },

  twinClassFreezeId: {
    id: "twinClassFreezeId",
    accessorKey: "twinClassFreezeId",
    header: "Freeze",
    cell: ({ row: { original } }) =>
      original.twinClassFreeze ? (
        <div className="inline-flex max-w-48">
          <TwinClassFreezeResourceLink
            data={original.twinClassFreeze as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ) : null,
  },

  uniqueName: {
    id: "uniqueName",
    accessorKey: "uniqueName",
    header: () => <SortableHeader title="Unique name" sortField="uniqueName" />,
    cell: (data) => data.getValue() && <Check />,
  },

  twinCounter: {
    id: "twinCounter",
    accessorKey: "twinCounter",
    header: () => (
      <SortableHeader title="Twins count" sortField="twinCounter" />
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

export function TwinClasses({ type }: { type?: string }) {
  const api = useContext(PrivateApiContext);
  const router = useRouter();
  const { twinClass } = useContext(TwinClassContext);
  const tableRef = useRef<DataTableHandle>(null);
  const duplicateDialogRef = useRef<TwinClassDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<TwinClassExportSqlDialogRef>(null);
  const [activeTab, setActiveTab] = useState("list");
  const { searchByFilters, simplifiedSearchByFilters } = useTwinClassSearch();
  const { countTwinClass } = useTwinClassCount();
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFilters();

  async function fetchTwinClassesHeadTreePage(
    params: FetchTreePageParams
  ): Promise<FetchTreePageResult> {
    let res;

    if (params.mode === "root") {
      //* ROOTS: all classes with no headClassId
      res = await simplifiedSearchByFilters({
        pagination: params.pagination,
        filters: {
          headHierarchyChildsForTwinClassSearch: {
            idList: ["ffffffff-ffff-ffff-ffff-ffffffffffff"],
            depth: 1,
          },
          abstractt: "ONLY_NOT",
        },
      });
    } else {
      res = await simplifiedSearchByFilters({
        pagination: params.pagination,
        filters: {
          headHierarchyChildsForTwinClassSearch: params.override,
          abstractt: "ONLY_NOT",
        },
      });
    }

    const total = res.pagination?.total ?? 0;
    const loaded =
      (params.pagination.pageIndex + 1) * params.pagination.pageSize;

    return {
      data: res.data,
      hasMore: loaded < total,
    };
  }

  async function fetchTwinClassesTreePage(
    params: FetchTreePageParams
  ): Promise<FetchTreePageResult> {
    let res;

    if (params.mode === "root") {
      res = await simplifiedSearchByFilters({
        pagination: params.pagination,
        filters: {
          twinClassIdList: params.twinClassIdList,
        },
      });
    } else {
      res = await simplifiedSearchByFilters({
        pagination: params.pagination,
        filters: {
          extendsHierarchyChildsForTwinClassSearch: params.override,
        },
      });
    }

    const total = res.pagination?.total ?? 0;
    const loaded =
      (params.pagination.pageIndex + 1) * params.pagination.pageSize;

    return {
      data: res.data,
      hasMore: loaded < total,
    };
  }

  function buildOverrideFilters():
    | Record<string, TwinClassFiltersHierarchyOverride>
    | undefined {
    if (!twinClass) return undefined;

    if (type === "Heads") {
      return {
        headHierarchyParentsForTwinClassSearch: {
          idList: [twinClass.id],
          depth: 1,
        },
      };
    }

    if (type === "Childs") {
      return {
        headHierarchyChildsForTwinClassSearch: {
          idList: [twinClass.id],
          depth: 1,
        },
      };
    }

    return undefined;
  }

  async function fetchTwinClasses(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<TwinClass_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    const _override = buildOverrideFilters();

    try {
      return await searchByFilters({
        pagination,
        filters: { ..._filters, ...(_override || {}) },
        sort,
      });
    } catch {
      toast.error("Failed to fetch twin classes");
      return { data: [], pagination: {} };
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/twin_class/count/v1), bound to the active filters and the
  // (optional) head/extends hierarchy scope of this view.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<TwinClassFilterKeys, unknown>
      );
      const scopedFilters = {
        ...resolved,
        ...(buildOverrideFilters() || {}),
      };

      return [
        {
          key: "ownerType",
          label: "Owner type",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "ownerType",
                offset,
                limit,
              }),
            (g) => g.ownerType,
            (g) => g.ownerType
          ),
        },
        {
          key: "headClass",
          label: "Head",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "headTwinClassId",
                offset,
                limit,
              }),
            (g) => g.headTwinClassId,
            (g) => g.headTwinClass?.name,
            (g) =>
              g.headTwinClass && (
                <TwinClassResourceLink
                  data={g.headTwinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "extendsClass",
          label: "Extends",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "extendsTwinClassId",
                offset,
                limit,
              }),
            (g) => g.extendsTwinClassId,
            (g) => g.extendsTwinClass?.name,
            (g) =>
              g.extendsTwinClass && (
                <TwinClassResourceLink
                  data={g.extendsTwinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "markerDataList",
          label: "Markers list",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "markerDataListId",
                offset,
                limit,
              }),
            (g) => g.markerDataListId,
            (g) => g.markerDataList?.name,
            (g) =>
              g.markerDataList && (
                <DatalistResourceLink
                  data={g.markerDataList as DataList}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "tagDataList",
          label: "Tags list",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "tagDataListId",
                offset,
                limit,
              }),
            (g) => g.tagDataListId,
            (g) => g.tagDataList?.name,
            (g) =>
              g.tagDataList && (
                <DatalistResourceLink
                  data={g.tagDataList as DataList}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "headHunterFeaturer",
          label: "Head hunter",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "headHunterFeaturerId",
                offset,
                limit,
              }),
            (g) =>
              g.headHunterFeaturerId != null
                ? String(g.headHunterFeaturerId)
                : undefined,
            (g) => g.headHunterFeaturer?.name,
            (g) =>
              g.headHunterFeaturer && (
                <FeaturerResourceLink
                  data={g.headHunterFeaturer as Featurer_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "viewPermission",
          label: "View permission",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "viewPermissionId",
                offset,
                limit,
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
          key: "abstract",
          label: "Abstract",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "abstractt",
                offset,
                limit,
              }),
            (g) =>
              g.abstractt == null
                ? undefined
                : g.abstractt
                  ? "Abstract"
                  : "Not abstract",
            (g) =>
              g.abstractt == null
                ? undefined
                : g.abstractt
                  ? "Abstract"
                  : "Not abstract"
          ),
        },
        {
          key: "assigneeRequired",
          label: "Assignee required",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "assigneeRequired",
                offset,
                limit,
              }),
            (g) =>
              g.assigneeRequired == null
                ? undefined
                : g.assigneeRequired
                  ? "Required"
                  : "Not required",
            (g) =>
              g.assigneeRequired == null
                ? undefined
                : g.assigneeRequired
                  ? "Required"
                  : "Not required"
          ),
        },
        {
          key: "segment",
          label: "Segment",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "segment",
                offset,
                limit,
              }),
            (g) => boolLabel(g.segment, "Segment", "Not segment"),
            (g) => boolLabel(g.segment, "Segment", "Not segment")
          ),
        },
        {
          key: "twinClassFreeze",
          label: "Freeze",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "twinClassFreezeId",
                offset,
                limit,
              }),
            (g) => g.twinClassFreezeId,
            (g) => g.twinClassFreeze?.name,
            (g) =>
              g.twinClassFreeze && (
                <TwinClassFreezeResourceLink
                  data={g.twinClassFreeze as TwinClass_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "twinflowSchemaSpace",
          label: "Twinflow schema",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "twinflowSchemaSpace",
                offset,
                limit,
              }),
            (g) => boolLabel(g.twinflowSchemaSpace, "Yes", "No"),
            (g) => boolLabel(g.twinflowSchemaSpace, "Yes", "No")
          ),
        },
        {
          key: "twinClassSchemaSpace",
          label: "Twinclass schema",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "twinClassSchemaSpace",
                offset,
                limit,
              }),
            (g) => boolLabel(g.twinClassSchemaSpace, "Yes", "No"),
            (g) => boolLabel(g.twinClassSchemaSpace, "Yes", "No")
          ),
        },
        {
          key: "aliasSpace",
          label: "Alias space",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "aliasSpace",
                offset,
                limit,
              }),
            (g) => boolLabel(g.aliasSpace, "Yes", "No"),
            (g) => boolLabel(g.aliasSpace, "Yes", "No")
          ),
        },
        {
          key: "uniqueName",
          label: "Unique name",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "uniqueName",
                offset,
                limit,
              }),
            (g) => boolLabel(g.uniqueName, "Yes", "No"),
            (g) => boolLabel(g.uniqueName, "Yes", "No")
          ),
        },
        {
          key: "hasDynamicMarkers",
          label: "Has dynamic markers",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countTwinClass({
                filters: scopedFilters,
                groupField: "hasDynamicMarkers",
                offset,
                limit,
              }),
            (g) => boolLabel(g.hasDynamicMarkers, "Yes", "No"),
            (g) => boolLabel(g.hasDynamicMarkers, "Yes", "No")
          ),
        },
      ];
    },
    [countTwinClass, mapFiltersToPayload, twinClass, type]
  );

  const twinClassesForm = useForm<TwinClassFieldValues>({
    resolver: zodResolver(TWIN_CLASSES_SCHEMA),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      abstractClass: false,
      segment: false,
      assigneeRequired: false,
      headTwinClass: null,
      headHunterFeaturerId: undefined,
      headHunterParams: {},
      extendsTwinClassId: null,
      logo: "",
      permissionSchemaSpace: false,
      twinflowSchemaSpace: false,
      twinClassSchemaSpace: false,
      aliasSpace: false,
      autoCreateTwinflow: false,
      autoCreatePermissions: true,
      space: false,
      uniqueName: false,
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof TWIN_CLASSES_SCHEMA>
  ) => {
    const {
      name,
      description,
      headTwinClass,
      headHunterFeaturerId,
      headHunterParams,
      extendsTwinClassId,
      autoCreatePermissions,
      viewPermissionId,
      createPermissionId,
      tagDataListId,
      markerDataListId,
      segment,
      assigneeRequired,
      autoCreateTwinflow,
      ownerType,
      abstractClass,
      permissionSchemaSpace,
      twinflowSchemaSpace,
      twinClassSchemaSpace,
      aliasSpace,
      key,
      uniqueName,
    } = formValues;

    const twinClassCreateRq: TwinClassCreateRq = {
      twinClassCreates: [
        {
          key,
          nameI18n: name
            ? {
                translationInCurrentLocale: name,
                translations: {},
              }
            : undefined,
          descriptionI18n: description
            ? {
                translationInCurrentLocale: description,
                translations: {},
              }
            : undefined,
          abstractClass,
          segment,
          assigneeRequired,
          ownerType,
          headTwinClassId: headTwinClass?.[0]?.id,
          headHunterFeaturerId,
          headHunterParams,
          extendsTwinClassId: extendsTwinClassId || undefined,
          markerDataListId: markerDataListId || undefined,
          tagDataListId: tagDataListId || undefined,
          autoCreatePermissions,
          uniqueName,
          autoCreateTwinflow,
          viewPermissionId: !autoCreatePermissions
            ? viewPermissionId
            : undefined,
          createPermissionId: !autoCreatePermissions
            ? createPermissionId
            : undefined,
          permissionSchemaSpace,
          twinflowSchemaSpace,
          twinClassSchemaSpace,
          aliasSpace,
        },
      ],
    };

    try {
      const { error } = await api.twinClass.create({
        body: twinClassCreateRq,
      });

      if (error) {
        toast.error("Failed to create twin class");
        throw error;
      }

      toast.success("Twin class created successfully!");
      tableRef.current?.refresh();
    } catch (error) {
      console.error("Create error:", error);
      throw error;
    }
  };

  const actionsCol: ColumnDef<TwinClass_DETAILED> = {
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

            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                exportSqlDialogRef.current?.open(original);
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

  const tabs = [
    {
      key: "list",
      label: "List",
      content: (
        <CrudDataTable
          ref={tableRef}
          fetcher={fetchTwinClasses}
          columns={[
            colDefs.iconLight,
            colDefs.id,
            colDefs.key,
            colDefs.name,
            colDefs.description,
            colDefs.headClassId,
            colDefs.extendsClassId,
            colDefs.abstractClass,
            colDefs.assigneeRequired,
            colDefs.ownerType,
            colDefs.permissionSchemaSpace,
            colDefs.twinflowSchemaSpace,
            colDefs.twinClassSchemaSpace,
            colDefs.aliasSpace,
            colDefs.markersDataListId,
            colDefs.tagsDataListId,
            colDefs.viewPermissionId,
            colDefs.createPermissionId,
            colDefs.externalId,
            colDefs.segment,
            colDefs.hasSegment,
            colDefs.twinClassFreezeId,
            colDefs.uniqueName,
            colDefs.twinCounter,
            actionsCol,
          ]}
          getRowId={(row) => row.id!}
          chartGroupings={buildChartGroupings}
          onRowClick={(row) =>
            router.push(`/${PlatformArea.core}/twinclass/${row.id}`)
          }
          filters={{
            filtersInfo: buildFilterFields(),
          }}
          defaultVisibleColumns={[
            colDefs.id,
            colDefs.key,
            colDefs.name,
            colDefs.headClassId,
            colDefs.assigneeRequired,
            colDefs.extendsClassId,
            colDefs.abstractClass,
            colDefs.markersDataListId,
            colDefs.tagsDataListId,
            colDefs.externalId,
            colDefs.segment,
            colDefs.hasSegment,
            colDefs.twinClassFreezeId,
            colDefs.twinCounter,
            actionsCol,
          ]}
          dialogForm={twinClassesForm}
          onCreateSubmit={!type ? handleOnCreateSubmit : undefined}
          renderFormFields={() => (
            <TwinClassFormFields control={twinClassesForm.control} />
          )}
          title={type || ""}
        />
      ),
    },
    {
      key: "extendsTree",
      label: "Extends tree",
      content: (
        <TwinClassesExtendsTreeView fetchTreePage={fetchTwinClassesTreePage} />
      ),
    },
    {
      key: "headTree",
      label: "Head tree",
      content: (
        <TwinClassesHeadTreeView fetchTreePage={fetchTwinClassesHeadTreePage} />
      ),
    },
  ];
  const activeTabContent =
    tabs.find((tab) => tab.key === activeTab)?.content ?? tabs[0]?.content;

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-4">
      <nav className="border-border bg-background flex w-full overflow-x-auto border-b">
        <div className="flex min-w-max items-center gap-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "text-muted-foreground rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                "hover:bg-muted hover:text-foreground",
                activeTab === tab.key &&
                  "bg-brand-500/10 text-brand-600 hover:bg-brand-500/10 hover:text-brand-600"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex min-h-0 flex-1 flex-col">{activeTabContent}</div>

      <TwinClassDuplicateDialog
        ref={duplicateDialogRef}
        onSuccess={() => tableRef.current?.refresh()}
      />

      <TwinClassExportSqlDialog
        ref={exportSqlDialogRef}
        onSuccess={() => tableRef.current?.refresh()}
      />
    </div>
  );
}
