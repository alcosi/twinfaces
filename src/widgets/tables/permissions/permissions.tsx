import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  CreatePermissionRequestBody,
  PERMISSION_SCHEMA,
  type Permission,
  PermissionFormValues,
  Permission_DETAILED,
  usePermissionCount,
  usePermissionCreate,
  usePermissionFilters,
  usePermissionSearchV1,
} from "@/entities/permission";
import { PermissionGroup } from "@/entities/permission-group";
import { useFetchPermissionsByUserId } from "@/entities/user";
import { PermissionGroupResourceLink } from "@/features/permission-group/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";
import { PermissionsFormFields } from "./form-fields";

const colDefs: Record<
  keyof Omit<Permission, "group">,
  ColumnDef<Permission>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
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
    cell: ({ row }) => (
      <div className="column-flex max-w-48 space-y-2">
        <PermissionResourceLink data={row.original} withTooltip />
      </div>
    ),
  },

  groupId: {
    id: "groupId",
    accessorKey: "groupId",
    header: () => <SortableHeader title="Group" sortField="groupName" />,
    cell: ({ row: { original } }) =>
      original.group && (
        <div className="inline-flex max-w-48">
          <PermissionGroupResourceLink
            data={original.group as PermissionGroup}
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

export function PermissionsTable({
  userId,
  title,
}: {
  userId?: string;
  title?: string;
}) {
  const tableRef = useRef<DataTableHandle>(null);
  const { searchPermissions } = usePermissionSearchV1();
  const { countPermissions } = usePermissionCount();
  const { buildFilterFields, mapFiltersToPayload } = usePermissionFilters();
  const { createPermission } = usePermissionCreate();
  const { fetchPermissionsByUserId } = useFetchPermissionsByUserId();
  const router = useRouter();

  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(PERMISSION_SCHEMA),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      groupId: "",
    },
  });

  async function fetchPermissions(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<Permission_DETAILED | Permission>> {
    try {
      if (userId) {
        const response = await fetchPermissionsByUserId(userId);

        return {
          data: response ?? [],
          pagination: {},
        };
      } else {
        const _filters = mapFiltersToPayload(filters.filters);
        const response = await searchPermissions({
          pagination,
          filters: _filters,
          sort,
        });

        return response;
      }
    } catch (e) {
      console.error("Failed to fetch permissions", e);
      toast.error("Failed to fetch permissions");
      return { data: [], pagination: {} };
    }
  }

  // Server-side pie-chart breakdown backed by /private/permission/count/v1,
  // bound to the active filters. Permissions can only be grouped by their
  // permission group.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(filters);

      return [
        {
          key: "group",
          label: "Group",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countPermissions({
                filters: resolved,
                groupField: "groupId",
                offset,
                limit,
              }),
            (g) => g.groupId,
            (g) => g.group?.name,
            (g) =>
              g.group && (
                <PermissionGroupResourceLink
                  data={g.group as PermissionGroup}
                  withTooltip
                />
              )
          ),
        },
      ];
    },
    [countPermissions, mapFiltersToPayload]
  );

  async function handleCreate(formValues: z.infer<typeof PERMISSION_SCHEMA>) {
    const body: CreatePermissionRequestBody = {
      groupId: formValues.groupId,
      key: formValues.key,
      nameI18n: {
        translations: {
          en: formValues.name,
        },
      },
      descriptionI18n: formValues.description
        ? {
            translations: {
              en: formValues.description,
            },
          }
        : undefined,
    };

    await createPermission({ body });
    toast.success("Permission created successfully!");
  }

  return (
    <CrudDataTable
      permissionSegment="permissions"
      ref={tableRef}
      columns={[
        colDefs.id!,
        colDefs.key!,
        colDefs.name!,
        colDefs.groupId!,
        colDefs.description!,
      ]}
      fetcher={fetchPermissions}
      getRowId={(row) => row.id!}
      disablePagination={isTruthy(userId)}
      {...(isFalsy(userId) && {
        filters: {
          filtersInfo: buildFilterFields(),
        },
      })}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/permissions/${row.id}`)
      }
      getRowHref={(row) => `/${PlatformArea.core}/permissions/${row.id}`}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.groupId,
        colDefs.description,
      ]}
      orderedColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.groupId,
        colDefs.description,
      ]}
      {...(isFalsy(userId) && {
        chartGroupings: buildChartGroupings,
      })}
      dialogForm={form}
      onCreateSubmit={handleCreate}
      renderFormFields={() => <PermissionsFormFields control={form.control} />}
      title={title}
    />
  );
}
