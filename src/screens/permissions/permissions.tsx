import {
  CreatePermissionRequestBody,
  type Permission,
  Permission_DETAILED,
  PERMISSION_SCHEMA,
  PermissionFormValues,
  UpdatePermissionRequestBody,
  usePermissionFilters,
  usePermissionSearchV1,
} from "@/entities/permission";
import { PermissionResourceLink } from "@/entities/permission/components/resource-link/resource-link";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext, PagedResponse } from "@/shared/api";
import { FiltersState } from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PermissionsFormFields } from "./form-fields";
import {
  PermissionGroup,
  PermissionGroupResourceLink,
} from "@/entities/permissionGroup";

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
      <div className="max-w-48 column-flex space-y-2">
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
        <div className="max-w-48 inline-flex">
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
  },
};

export function Permissions() {
  const api = useContext(ApiContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchPermissions } = usePermissionSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = usePermissionFilters();

  useEffect(() => {
    setBreadcrumbs([{ label: "Permissions", href: "/permission" }]);
  }, []);

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
  ): Promise<PagedResponse<Permission_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchPermissions({
        pagination,
        filters: _filters,
      });

      return response;
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

    const { error } = await api.permission.create({ body });
    if (error) {
      throw error;
    }
    toast.success("Link created successfully!");
  }

  async function handleUpdate(
    permissionId: string,
    formValues: z.infer<typeof PERMISSION_SCHEMA>
  ) {
    const body: UpdatePermissionRequestBody = {
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

    const { error } = await api.permission.update({ permissionId, body });
    if (error) {
      throw error;
    }
    toast.success("Permission updated successfully!");
  }

  return (
    <Experimental_CrudDataTable
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
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
      filters={{
        filtersInfo: buildFilterFields(),
      }}
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
      onUpdateSubmit={handleUpdate}
      renderFormFields={() => <PermissionsFormFields control={form.control} />}
    />
  );
}
