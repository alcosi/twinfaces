import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  CreatePermissionRequestBody,
  PERMISSION_SCHEMA,
  type Permission,
  PermissionFormValues,
  Permission_DETAILED,
  useFetchPermissionsByUserId,
  usePermissionCreate,
  usePermissionFilters,
  usePermissionSearchV1,
} from "@/entities/permission";
import { PermissionGroup } from "@/entities/permission-group";
import { PermissionGroupResourceLink } from "@/features/permission-group/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
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
    header: "Key",
  },

  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="column-flex max-w-48 space-y-2">
        <PermissionResourceLink data={row.original} withTooltip />
      </div>
    ),
  },

  groupId: {
    id: "groupId",
    accessorKey: "groupId",
    header: "Group",
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
    header: "Description",
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
    filters: FiltersState
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
        });

        return response;
      }
    } catch (e) {
      console.error("Failed to fetch permissions", e);
      toast.error("Failed to fetch permissions");
      return { data: [], pagination: {} };
    }
  }

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
      pageSizes={[10, 20, 50]}
      disablePagination={isTruthy(userId)}
      {...(isFalsy(userId) && {
        filters: {
          filtersInfo: buildFilterFields(),
        },
      })}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/permissions/${row.id}`)
      }
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
      groupableColumns={[colDefs.name, colDefs.groupId, colDefs.description]}
      dialogForm={form}
      onCreateSubmit={handleCreate}
      renderFormFields={() => <PermissionsFormFields control={form.control} />}
      title={title}
    />
  );
}
