import {
  UserGroup_DETAILED,
  useUserGroupSearchV1,
  useUserGroupsFilters,
} from "@/entities/userGroup";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { formatToTwinfaceDate } from "@/shared/libs";
import { BusinessAccountResourceLink } from "@/entities/business-account";

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
        <div className="max-w-48 inline-flex">
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
      formatToTwinfaceDate(original.businessAccount.createdAt),
  },
};

export function UserGroups() {
  const tableRef = useRef<DataTableHandle>(null);
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchUserGroups } = useUserGroupSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = useUserGroupsFilters();

  useEffect(() => {
    setBreadcrumbs([{ label: "Groups", href: "/workspace/user-groups" }]);
  }, []);

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
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
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
