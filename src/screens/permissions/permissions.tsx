import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import {
  buildFilterFields,
  CreatePermissionRequestBody,
  mapToPermissionApiFilters,
  PERMISSION_SCHEMA,
  PermissionFormValues,
  UpdatePermissionRequestBody,
  usePermissionSearchV1,
  type Permission,
} from "@/entities/permission";
import { PermissionResourceLink } from "@/entities/permission/components/resource-link/resource-link";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PermissionsFormFields } from "./form-fields";

const colDefs: Record<
  keyof Omit<Permission, "group">,
  ColumnDef<Permission>
> = {
  groupId: {
    id: "groupId",
    accessorKey: "groupId",
    header: "Group",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
  },
  id: {
    id: "id",
    accessorKey: "id",
    header: "Id",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
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
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
};

function mergeUniquePermissions(
  existing: Permission[],
  incoming: Permission[]
): Permission[] {
  const existingIds = new Set(existing.map((perm) => perm.id));
  const uniqueIncoming = incoming.filter((perm) => !existingIds.has(perm.id));
  return [...existing, ...uniqueIncoming];
}

export function Permissions() {
  const api = useContext(ApiContext);
  const tableRef = useRef<DataTableHandle>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchPermissions } = usePermissionSearchV1();

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
  ): Promise<{ data: Permission[]; pageCount: number }> {
    const _filters = mapToPermissionApiFilters(filters.filters);

    try {
      const response = await searchPermissions({
        pagination,
        filters: _filters,
      });
      setPermissions((prev) => mergeUniquePermissions(prev, response.data));

      return response;
    } catch (e) {
      console.error("Failed to fetch permissions", e);
      toast.error("Failed to fetch permissions");
      setPermissions([]);
      return { data: [], pageCount: 0 };
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
        colDefs.groupId!,
        colDefs.id!,
        colDefs.key!,
        colDefs.name!,
        colDefs.description!,
      ]}
      fetcher={fetchPermissions}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(permissions),
        onChange: () => Promise.resolve(),
      }}
      defaultVisibleColumns={[
        colDefs.groupId,
        colDefs.name,
        colDefs.description,
      ]}
      orderedColumns={[
        colDefs.groupId,
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.description,
      ]}
      groupableColumns={[colDefs.groupId, colDefs.name, colDefs.description]}
      dialogForm={form}
      onCreateSubmit={handleCreate}
      onUpdateSubmit={handleUpdate}
      renderFormFields={() => <PermissionsFormFields control={form.control} />}
    />
  );
}
