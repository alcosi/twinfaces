import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import {
  buildFilterFields,
  mapToPermissionApiFilters,
  type Permission,
} from "@/entities/permission";
import { ApiContext } from "@/lib/api/api";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";

const columnsMap: Record<keyof Permission, ColumnDef<Permission>> = {
  groupId: {
    accessorKey: "groupId",
    header: "Group Id",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
  },
  id: {
    accessorKey: "id",
    header: "Id",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
  },
  key: {
    accessorKey: "key",
    header: "Key",
  },
  name: {
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <PermissionResourceLink data={original} withTooltip />
      </div>
    ),
  },
  description: {
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

  // NOTE: Uncomment the following lines to enable create and update actions once the backend API is available
  // const form = useForm<PermissionFormValues>({
  //   resolver: zodResolver(PERMISSION_SCHEMA),
  //   defaultValues: {
  //     key: "",
  //     name: "",
  //     description: "",
  //   },
  // });

  async function fetchPermissions(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapToPermissionApiFilters(filters.filters);

    try {
      const response = await api.permission.search({
        pagination,
        filters: _filters,
      });
      const permissions = response.data?.permissions ?? [];

      setPermissions((prev) => mergeUniquePermissions(prev, permissions));
      return { data: permissions, pageCount: 0 };
    } catch (e) {
      console.error("Failed to fetch permissions", e);
      toast.error("Failed to fetch permissions");
      setPermissions([]);
      return { data: [], pageCount: 0 };
    }
  }

  return (
    <>
      <Experimental_CrudDataTable
        className="mb-10"
        ref={tableRef}
        columns={[
          columnsMap.groupId,
          columnsMap.id,
          columnsMap.key,
          columnsMap.name,
          columnsMap.description,
        ]}
        fetcher={fetchPermissions}
        getRowId={(row) => row.id!}
        pageSizes={[10, 20, 50]}
        filters={{
          filtersInfo: buildFilterFields(permissions),
          onChange: () => Promise.resolve(),
        }}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "groupId",
            // "id",
            // "key",
            "name",
            "description",
          ],
        }}
        // NOTE: Uncomment the following lines to enable create and update actions once the backend API is available
        // dialogForm={form}
        // onCreateSubmit={handleCreate}
        // onUpdateSubmit={handleUpdate}
        // renderFormFields={() => (
        //   <PermissionsFormFields control={form.control} />
        // )}
      />
    </>
  );
}
