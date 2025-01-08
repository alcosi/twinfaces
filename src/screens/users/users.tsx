import { usePermissionFilters } from "@/entities/permission";
import {
  DomainUser,
  DomainUser_DETAILED,
  useDomainUserSearchV1,
  UserResourceLink,
} from "@/entities/user";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Pick<DomainUser, "id" | "userId" | "createdAt">,
  ColumnDef<DomainUser_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  userId: {
    id: "userId",
    accessorKey: "userId",
    header: "User Id",
    cell: ({ row: { original } }) =>
      original.user && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.user} withTooltip />
        </div>
      ),
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function Users() {
  const tableRef = useRef<DataTableHandle>(null);
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchUsers } = useDomainUserSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = usePermissionFilters();

  useEffect(() => {
    setBreadcrumbs([{ label: "Users", href: "/workspace/users" }]);
  }, []);

  async function fetchUsers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<DomainUser_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchUsers({
        pagination,
        filters: _filters,
      });

      return response;
    } catch (e) {
      toast.error("Failed to fetch users");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
      ref={tableRef}
      columns={[colDefs.id, colDefs.userId, colDefs.createdAt]}
      fetcher={fetchUsers}
      getRowId={(row) => row.id}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[colDefs.id, colDefs.userId, colDefs.createdAt]}
      orderedColumns={[colDefs.id, colDefs.userId, colDefs.createdAt]}
    />
  );
}
