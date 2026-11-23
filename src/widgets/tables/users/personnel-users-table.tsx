"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRef } from "react";
import { toast } from "sonner";

import {
  DomainUser_DETAILED,
  useDomainUserSearchV1,
  useUserFilters,
} from "@/entities/user";
import { UserGroupResourceLink } from "@/features/user-group/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { isPopulatedArray } from "@/shared/libs";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";

// Personnel screen: real user accounts via the domain users endpoint
// (not twins).
const colDefs: {
  name: ColumnDef<DomainUser_DETAILED>;
  role: ColumnDef<DomainUser_DETAILED>;
} = {
  name: {
    id: "name",
    accessorKey: "user.fullName",
    header: "Name",
    cell: ({ row: { original } }) =>
      original.user && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.user} withTooltip />
        </div>
      ),
  },
  role: {
    id: "role",
    accessorKey: "userGroups",
    header: "Role",
    cell: ({ row: { original } }) =>
      isPopulatedArray(original.userGroups) && (
        <div className="inline-flex max-w-48 flex-wrap gap-2">
          {original.userGroups.map((group) => (
            <UserGroupResourceLink key={group.id} data={group} withTooltip />
          ))}
        </div>
      ),
  },
};

export function PersonnelUsersTable() {
  const tableRef = useRef<DataTableHandle>(null);
  const { searchUsers } = useDomainUserSearchV1();
  const { mapFiltersToPayload } = useUserFilters();

  async function fetchUsers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<DomainUser_DETAILED>> {
    try {
      return await searchUsers({
        pagination,
        filters: mapFiltersToPayload(filters.filters),
      });
    } catch (e) {
      toast.error("Failed to fetch users");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      permissionSegment="users"
      ref={tableRef}
      columns={[colDefs.name, colDefs.role]}
      fetcher={fetchUsers}
      getRowId={(row) => row.userId}
      defaultVisibleColumns={[colDefs.name, colDefs.role]}
    />
  );
}
