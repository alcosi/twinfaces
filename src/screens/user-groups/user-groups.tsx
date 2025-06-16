import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRef } from "react";
import { toast } from "sonner";

import {
  UserGroup_DETAILED,
  useUserGroupSearchV1,
  useUserGroupsFilters,
} from "@/entities/user-group";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";

const colDefs: Record<
  "id" | "name" | "type" | "description" | "createdAt" | "businessAccount",
  ColumnDef<UserGroup_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
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

  type: {
    id: "type",
    accessorKey: "type",
    header: "Type",
  },

  businessAccount: {
    id: "businessAccount",
    accessorKey: "businessAccount",
    header: "Business account",
    cell: ({ row: { original } }) =>
      original.businessAccount && (
        <div className="inline-flex max-w-48">
          <BusinessAccountResourceLink
            data={original.businessAccount}
            withTooltip
          />
        </div>
      ),
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.businessAccount?.createdAt &&
      formatIntlDate(original.businessAccount.createdAt, "datetime-local"),
  },
};

export function UserGroups() {
  const tableRef = useRef<DataTableHandle>(null);
  const { searchUserGroups } = useUserGroupSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = useUserGroupsFilters();

  async function fetchUserGroups(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<UserGroup_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchUserGroups({
        pagination,
        filters: _filters,
      });

      return response;
    } catch (e) {
      toast.error("Failed to fetch user groups");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.name,
        colDefs.type,
        colDefs.businessAccount,
        colDefs.description,
        colDefs.createdAt,
      ]}
      fetcher={fetchUserGroups}
      getRowId={(row) => row.id}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.businessAccount,
        colDefs.type,
        colDefs.createdAt,
      ]}
      orderedColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.type,
        colDefs.businessAccount,
        colDefs.description,
        colDefs.createdAt,
      ]}
    />
  );
}
