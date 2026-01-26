"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check, Unplug } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  TWIN_CLASSES_SCHEMA,
  TwinClassContext,
  TwinClassCreateRq,
  TwinClassFieldValues,
  TwinClassFiltersHierarchyOverride,
  TwinClass_DETAILED,
  useTwinClassFilters,
  useTwinClassSearch,
} from "@/entities/twin-class";
import { DatalistResourceLink } from "@/features/datalist/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassFreezeResourceLink } from "@/features/twin-class-freeze/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { ImageWithFallback } from "@/features/ui/image-with-fallback";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";

import { TwinClassFormFields } from "./form-fields";
import {
  FetchTreePageResult,
  TwinClassesExtendsTreeView,
  TwinClassesHeadTreeView,
  TwinClassesView,
  ViewSwitcher,
} from "./view";

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
    | "editPermissionId"
    | "deletePermissionId"
    | "ownerType"
    | "externalId"
    | "segment"
    | "hasSegment"
    | "twinClassFreezeId"
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
    header: "Key",
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
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
  headClassId: {
    id: "headClassId",
    accessorKey: "headClassId",
    header: "Head",
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
    header: "Extends",
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
    header: "Abstract",
    cell: (data) => data.getValue() && <Check />,
  },

  assigneeRequired: {
    id: "assigneeRequired",
    accessorKey: "assigneeRequired",
    header: "Assignee required",
    cell: (data) => data.getValue() && <Check />,
  },

  ownerType: {
    id: "ownerType",
    accessorKey: "ownerType",
    header: "Owner type",
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
    header: "Twinflow schema",
    cell: (data) => data.getValue() && <Check />,
  },
  twinClassSchemaSpace: {
    id: "twinClassSchemaSpace",
    accessorKey: "twinClassSchemaSpace",
    header: "Twinclass schema",
    cell: (data) => data.getValue() && <Check />,
  },
  aliasSpace: {
    id: "aliasSpace",
    accessorKey: "aliasSpace",
    header: "Alias space",
    cell: (data) => data.getValue() && <Check />,
  },
  markersDataListId: {
    id: "markersDataListId",
    accessorKey: "markersDataListId",
    header: "Markers list",
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
    header: "Tags list",
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
    header: "View permission",
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
  editPermissionId: {
    id: "editPermissionId",
    accessorKey: "editPermissionId",
    header: "Edit permission",
    cell: ({ row: { original } }) =>
      original.editPermission && (
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink data={original.editPermission} withTooltip />
        </div>
      ),
  },
  deletePermissionId: {
    id: "deletePermissionId",
    accessorKey: "deletePermissionId",
    header: "Delete permission",
    cell: ({ row: { original } }) =>
      original.deletePermission && (
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink
            data={original.deletePermission}
            withTooltip
          />
        </div>
      ),
  },

  externalId: {
    id: "externalId",
    accessorKey: "externalId",
    header: "External Id",
  },

  segment: {
    id: "segment",
    accessorKey: "segment",
    header: "Segment",
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
};

export function TwinClasses({ type }: { type?: string }) {
  const api = useContext(PrivateApiContext);
  const router = useRouter();
  const { twinClass } = useContext(TwinClassContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { searchByFilters, simplifiedSearchByFilters } = useTwinClassSearch();
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFilters();
  const [view, setView] = useState<TwinClassesView>("table");

  async function fetchTwinClassesTreePage(
    override: TwinClassFiltersHierarchyOverride,
    pagination: { pageIndex: number; pageSize: number }
  ): Promise<FetchTreePageResult> {
    const res = await simplifiedSearchByFilters({
      pagination,
      filters: {
        extendsHierarchyChildsForTwinClassSearch: override,
      },
    });

    const total = res.pagination?.total ?? 0;
    const loaded = (pagination.pageIndex + 1) * pagination.pageSize;

    return {
      data: res.data,
      hasMore: loaded < total,
    };
  }

  async function fetchTwinClasses(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinClass_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    let _override:
      | Record<string, TwinClassFiltersHierarchyOverride>
      | undefined;

    if (twinClass) {
      if (type === "Heads") {
        _override = {
          headHierarchyParentsForTwinClassSearch: {
            idList: [twinClass.id],
            depth: 1,
          },
        };
      }

      if (type === "Childs") {
        _override = {
          headHierarchyChildsForTwinClassSearch: {
            idList: [twinClass.id],
            depth: 1,
          },
        };
      }
    }

    try {
      return await searchByFilters({
        pagination,
        filters: { ..._filters, ...(_override || {}) },
      });
    } catch {
      toast.error("Failed to fetch twin classes");
      return { data: [], pagination: {} };
    }
  }

  const twinClassesForm = useForm<TwinClassFieldValues>({
    resolver: zodResolver(TWIN_CLASSES_SCHEMA),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      abstractClass: false,
      headTwinClass: null,
      headHunterFeaturerId: undefined,
      headHunterParams: {},
      extendsTwinClassId: null,
      logo: "",
      permissionSchemaSpace: false,
      twinflowSchemaSpace: false,
      twinClassSchemaSpace: false,
      aliasSpace: false,
      autoCreatePermissions: true,
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
      editPermissionId,
      deletePermissionId,
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
    } = formValues;

    const twinClassCreateRq: TwinClassCreateRq = {
      twinClassCreates: [
        {
          key,
          nameI18n: {
            translationInCurrentLocale: name,
            translations: {},
          },
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
          autoCreateTwinflow,
          viewPermissionId: !autoCreatePermissions
            ? viewPermissionId
            : undefined,
          createPermissionId: !autoCreatePermissions
            ? createPermissionId
            : undefined,
          editPermissionId: !autoCreatePermissions
            ? editPermissionId
            : undefined,
          deletePermissionId: !autoCreatePermissions
            ? deletePermissionId
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

  return (
    <div className="flex flex-col pt-4">
      <ViewSwitcher value={view} onChange={setView} />

      {view === "table" && (
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
            colDefs.editPermissionId,
            colDefs.deletePermissionId,
            colDefs.externalId,
            colDefs.segment,
            colDefs.hasSegment,
            colDefs.twinClassFreezeId,
          ]}
          getRowId={(row) => row.id!}
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
          ]}
          dialogForm={twinClassesForm}
          onCreateSubmit={!type ? handleOnCreateSubmit : undefined}
          renderFormFields={() => (
            <TwinClassFormFields control={twinClassesForm.control} />
          )}
          title={type || ""}
        />
      )}

      {view === "extendsTree" && (
        <TwinClassesExtendsTreeView fetchTreePage={fetchTwinClassesTreePage} />
      )}
      {view === "headTree" && <TwinClassesHeadTreeView />}
    </div>
  );
}
