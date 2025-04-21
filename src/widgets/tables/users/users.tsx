import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRef } from "react";
import { toast } from "sonner";

import {
  DomainUser,
  DomainUser_DETAILED,
  useDomainUserSearchV1,
  useUserFilters,
} from "@/entities/user";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    DomainUser,
    "id" | "user" | "createdAt" | "userId" | "currentLocale"
  >,
  ColumnDef<DomainUser_DETAILED>
> & {
  email: ColumnDef<DomainUser_DETAILED>;
  name: ColumnDef<DomainUser_DETAILED>;
} = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  userId: {
    id: "userId",
    accessorKey: "userId",
    header: "User ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  name: {
    id: "name",
    accessorKey: "user.fullName",
    header: "Name",
  },
  user: {
    id: "user",
    accessorKey: "user",
    header: "User",
    cell: ({ row: { original } }) =>
      original.user && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.user} withTooltip />
        </div>
      ),
  },
  email: {
    id: "email",
    accessorKey: "user.email",
    header: "Email",
  },
  currentLocale: {
    id: "currentLocale",
    accessorKey: "currentLocale",
    header: "Current locale",
    cell: ({ row: { original } }) =>
      original.currentLocale && original.currentLocale.toUpperCase(),
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function UsersTable() {
  const tableRef = useRef<DataTableHandle>(null);
  const { searchUsers } = useDomainUserSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = useUserFilters();

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
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.userId,
        colDefs.name,
        colDefs.user,
        colDefs.email,
        colDefs.currentLocale,
        colDefs.createdAt,
      ]}
      fetcher={fetchUsers}
      getRowId={(row) => row.userId}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.userId,
        colDefs.name,
        colDefs.user,
        colDefs.email,
        colDefs.currentLocale,
        colDefs.createdAt,
      ]}
    />
  );
}
