"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import {
  BusinessAccount,
  DomainBusinessAccountUserCountGroup,
  DomainBusinessAccountUserCountGroupField,
  DomainBusinessAccountUserFilterKeys,
  DomainBusinessAccountUserFilters,
  DomainBusinessAccountUser_DETAILED,
  useBusinessAccountUserCount,
  useBusinessAccountUserFilters,
  useBusinessAccountUserSearch,
} from "@/entities/business-account";
import { BusinessAccountContext } from "@/features/business-account";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { UserGroupResourceLink } from "@/features/user-group/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import {
  formatIntlDate,
  isFalsy,
  isTruthy,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import { getPieChartColor } from "@/shared/ui";

import {
  CHART_FETCH_LIMIT,
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupings,
  narrowBy,
} from "../../crud-data-table";

const UNSET_GROUP_LABEL = "— Not set —";

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
    header: () => <SortableHeader title="User" sortField="userName" />,
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
    header: () => (
      <SortableHeader
        title="Domain business account"
        sortField="businessAccountName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.businessAccount &&
      original.domainBusinessAccountId && (
        <div className="inline-flex max-w-48">
          <BusinessAccountResourceLink
            domainBusinessAccountId={original.domainBusinessAccountId}
            data={original.businessAccount}
            withTooltip
          />
        </div>
      ),
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
    header: () => <SortableHeader title="Created at" sortField="createdAt" />,
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
  lastActivityAt: {
    id: "lastActivityAt",
    accessorKey: "lastActivityAt",
    header: () => (
      <SortableHeader title="Last activity at" sortField="lastActivityAt" />
    ),
    cell: ({ row: { original } }) =>
      original.lastActivityAt &&
      formatIntlDate(original.lastActivityAt, "datetime-local"),
  },
};

export function BusinessAccountUsersTable({ userId }: { userId?: string }) {
  const { businessAccount } = useContext(BusinessAccountContext);
  const { searchBusinessAccountUser } = useBusinessAccountUserSearch();
  const { countBusinessAccountUser } = useBusinessAccountUserCount();
  const businessAccountId = businessAccount?.businessAccountId;

  const hasUserId = isTruthy(userId);
  const hasBusinessAccountId = isTruthy(businessAccountId);

  const showUserColumn = isFalsy(userId);
  const showBusinessAccountColumn = isFalsy(businessAccountId);

  const { buildFilterFields, mapFiltersToPayload } =
    useBusinessAccountUserFilters({
      enabledFilters: hasBusinessAccountId
        ? ["userIdList", "createdAt", "lastActivityAt", "userGroupIdList"]
        : hasUserId
          ? [
              "businessAccountIdList",
              "createdAt",
              "lastActivityAt",
              "userGroupIdList",
            ]
          : undefined,
    });

  // Maps the table filter values to the API payload and injects the
  // contextual user/business-account constraints. Shared by the table fetcher
  // and the pie-chart count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (
      rawFilters: Record<DomainBusinessAccountUserFilterKeys, unknown>
    ): DomainBusinessAccountUserFilters => {
      const mapped = mapFiltersToPayload(rawFilters);
      return {
        ...mapped,
        userIdList: userId
          ? toArrayOfString(toArray(userId), "id")
          : mapped.userIdList,
        businessAccountIdList: businessAccountId
          ? toArrayOfString(toArray(businessAccountId), "id")
          : mapped.businessAccountIdList,
      };
    },
    [mapFiltersToPayload, userId, businessAccountId]
  );

  async function fetchBusinesAccountUsers(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<DomainBusinessAccountUser_DETAILED>> {
    try {
      return await searchBusinessAccountUser({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<
            DomainBusinessAccountUserFilterKeys,
            unknown
          >
        ),
        sort,
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

  // Server-side breakdowns backed by
  // /private/domain/business_account_user/count/v1, bound to active filters:
  // the pie charts, and the grouping of the table view, whose groups open
  // through the matching search filters.
  const { chartGroupings: countChartGroupings, grouping } = useMemo(
    () =>
      buildCountGroupings<
        DomainBusinessAccountUser_DETAILED,
        DomainBusinessAccountUserCountGroup,
        DomainBusinessAccountUserFilters
      >({
        fields: showUserColumn
          ? [
              {
                key: "user",
                label: "User",
                groupField: "userId",
                getValue: (g) => g.userId,
                getText: (g) => g.user?.fullName,
                renderLabel: (g) =>
                  g.user && <UserResourceLink data={g.user} withTooltip />,
                narrow:
                  narrowBy.idList<DomainBusinessAccountUserFilters>(
                    "userIdList"
                  ),
              },
            ]
          : [],
        resolveFilters: ({ filters }) =>
          resolveFilters(
            filters as Record<DomainBusinessAccountUserFilterKeys, unknown>
          ),
        count: ({ filters, groupField, offset, limit }) =>
          countBusinessAccountUser({
            filters,
            groupField: groupField as DomainBusinessAccountUserCountGroupField,
            offset,
            limit,
          }),
        fetchRows: ({ filters, pagination, sort }) =>
          searchBusinessAccountUser({ pagination, filters, sort }),
      }),
    [
      resolveFilters,
      countBusinessAccountUser,
      searchBusinessAccountUser,
      showUserColumn,
    ]
  );

  // The pie charts: the count-backed ones, followed by the business account
  // breakdown, which the count endpoint can't serve (see below) and so stays
  // out of the table view's grouping.
  const buildChartGroupings = useCallback(
    (context: ChartDataContext): ChartGrouping[] => {
      const groupings = countChartGroupings(context);

      if (showBusinessAccountColumn) {
        const resolved = resolveFilters(
          context.filters as Record<
            DomainBusinessAccountUserFilterKeys,
            unknown
          >
        );

        groupings.push({
          key: "businessAccount",
          // The count endpoint only returns businessAccountId, but the resource
          // link needs domainBusinessAccountId (as in the table column). So we
          // aggregate the search results, which carry both ids.
          label: "Domain business account",
          // Aggregated client-side from the search results (which carry both
          // ids), so the whole set is known up front; slice it to honour the
          // chart view's paging.
          load: async ({ offset, limit }) => {
            const { data } = await searchBusinessAccountUser({
              pagination: { pageIndex: 0, pageSize: CHART_FETCH_LIMIT },
              filters: resolved,
            });

            const groups = new Map<
              string,
              { count: number; row: DomainBusinessAccountUser_DETAILED }
            >();
            for (const row of data) {
              const id = row.businessAccountId ?? UNSET_GROUP_LABEL;
              const existing = groups.get(id);
              if (existing) existing.count += 1;
              else groups.set(id, { count: 1, row });
            }

            const all = Array.from(groups.values())
              .sort((a, b) => b.count - a.count)
              .map(({ count, row }, index) => ({
                label:
                  (row.businessAccount as unknown as BusinessAccount)?.name ??
                  row.businessAccountId ??
                  UNSET_GROUP_LABEL,
                value: count,
                color: getPieChartColor(index),
                legendContent:
                  row.businessAccount && row.domainBusinessAccountId ? (
                    <BusinessAccountResourceLink
                      domainBusinessAccountId={row.domainBusinessAccountId}
                      data={row.businessAccount}
                      withTooltip
                    />
                  ) : undefined,
              }));

            return {
              data: all.slice(offset, offset + limit),
              total: all.length,
            };
          },
        });
      }

      return groupings;
    },
    [
      countChartGroupings,
      resolveFilters,
      searchBusinessAccountUser,
      showBusinessAccountColumn,
    ]
  );

  return (
    <CrudDataTable
      permissionSegment="users"
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
      chartGroupings={buildChartGroupings}
      grouping={grouping}
      getRowId={(row) =>
        `${row.userId}-${row.businessAccountId}-${row.createdAt ?? ""}`
      }
    />
  );
}
