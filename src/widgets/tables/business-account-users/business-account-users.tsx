import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useContext } from "react";
import { toast } from "sonner";

import {
  DomainBusinessAccountUserFilterKeys,
  DomainBusinessAccountUser_DETAILED,
  useBusinessAccountUserFilters,
  useBusinessAccountUserSearch,
} from "@/entities/business-account";
import { BusinessAccountContext } from "@/features/business-account";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { UserGroupResourceLink } from "@/features/user-group/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import {
  formatIntlDate,
  isFalsy,
  isTruthy,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    DomainBusinessAccountUser_DETAILED,
    "user" | "businessAccount" | "createdAt" | "lastActivityAt" | "userGroups"
  >,
  ColumnDef<DomainBusinessAccountUser_DETAILED>
> = {
  user: {
    id: "user",
    accessorKey: "user",
    header: "User",
    cell: ({ row: { original } }) =>
      original.user && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.user} withTooltip />
        </div>
      ),
  },
  businessAccount: {
    id: "businessAccount",
    accessorKey: "businessAccount",
    header: "Domain business account",
    cell: ({ row: { original } }) => {
      original.businessAccount && original.domainBusinessAccountId && (
        <div className="inline-flex max-w-48">
          <BusinessAccountResourceLink
            domainBusinessAccountId={original.domainBusinessAccountId}
            data={original.businessAccount}
            withTooltip
          />
        </div>
      );
    },
  },
  userGroups: {
    id: "userGroups",
    accessorKey: "userGroups",
    header: "Groups",
    cell: ({ row: { original } }) =>
      original.userGroups && (
        <div className="inline-flex max-w-48 gap-1">
          {original.userGroups.map((group) => (
            <UserGroupResourceLink key={group.id} data={group} withTooltip />
          ))}
        </div>
      ),
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
  lastActivityAt: {
    id: "lastActivityAt",
    accessorKey: "lastActivityAt",
    header: "Last activity at",
    cell: ({ row: { original } }) =>
      original.lastActivityAt &&
      formatIntlDate(original.lastActivityAt, "datetime-local"),
  },
};

export function BusinessAccountUsersTable({ userId }: { userId?: string }) {
  const { businessAccount } = useContext(BusinessAccountContext);
  const { searchBusinessAccountUser } = useBusinessAccountUserSearch();
  const businessAccountId = businessAccount?.businessAccountId;

  const hasUserId = isTruthy(userId);
  const hasBusinessAccountId = isTruthy(businessAccountId);

  const showUserColumn = isFalsy(userId);
  const showBusinessAccountColumn = isFalsy(businessAccountId);

  const { buildFilterFields, mapFiltersToPayload } =
    useBusinessAccountUserFilters({
      enabledFilters: hasBusinessAccountId
        ? [
            "userIdList",
            "createdAtFrom",
            "createdAtTo",
            "lastActivityAtFrom",
            "lastActivityAtTo",
            "userGroupIdList",
          ]
        : hasUserId
          ? [
              "businessAccountIdList",
              "createdAtFrom",
              "createdAtTo",
              "lastActivityAtFrom",
              "lastActivityAtTo",
              "userGroupIdList",
            ]
          : undefined,
    });

  async function fetchBusinesAccountUsers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<DomainBusinessAccountUser_DETAILED>> {
    const _filters = mapFiltersToPayload(
      filters.filters as Record<DomainBusinessAccountUserFilterKeys, unknown>
    );

    try {
      return await searchBusinessAccountUser({
        pagination,
        filters: {
          ..._filters,
          userIdList: userId
            ? toArrayOfString(toArray(userId), "id")
            : _filters.userIdList,
          businessAccountIdList: businessAccountId
            ? toArrayOfString(toArray(businessAccountId), "id")
            : _filters.businessAccountIdList,
        },
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching business account users:" + error
      );
      throw new Error(
        "An error occured while fetching business account users:" + error
      );
    }
  }

  return (
    <CrudDataTable
      title="Domain business account users"
      columns={[
        ...(showUserColumn ? [colDefs.user] : []),
        ...(showBusinessAccountColumn ? [colDefs.businessAccount] : []),
        colDefs.userGroups,
        colDefs.createdAt,
        colDefs.lastActivityAt,
      ]}
      defaultVisibleColumns={[
        ...(showUserColumn ? [colDefs.user] : []),
        ...(showBusinessAccountColumn ? [colDefs.businessAccount] : []),
        colDefs.userGroups,
        colDefs.createdAt,
        colDefs.lastActivityAt,
      ]}
      fetcher={fetchBusinesAccountUsers}
      filters={{ filtersInfo: buildFilterFields() }}
      getRowId={(row) =>
        `${row.userId}-${row.businessAccountId}-${row.createdAt ?? ""}`
      }
    />
  );
}
