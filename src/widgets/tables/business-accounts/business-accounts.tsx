"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  DomainBusinessAccountFilterKeys,
  DomainBusinessAccount_DETAILED,
  useBusinessAccountCount,
  useBusinessAccountSearch,
} from "@/entities/business-account";
import { useBusinessAccountFilters } from "@/entities/business-account/libs";
import { TwinClassSchema_DETAILED } from "@/entities/twin-class-schema";
import { TwinFlowSchema_DETAILED } from "@/entities/twinFlowSchema";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { NotificationSchemaResourceLink } from "@/features/notification-schema/ui";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { TierResourceLink } from "@/features/tier/ui";
import { TwinClassSchemaResourceLink } from "@/features/twin-class-schema/ui";
import { TwinFlowSchemaResourceLink } from "@/features/twin-flow-schema/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config/constants";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";

const colDefs: Record<
  | "id"
  | "permissionSchema"
  | "businessAccount"
  | "twinflowSchema"
  | "twinClassSchema"
  | "notificationSchema"
  | "tier"
  | "createdAt"
  | "attachmentsStorageUsedCount"
  | "attachmentsStorageUsedSize"
  | "twinsCount"
  | "activeUsersCount",
  ColumnDef<DomainBusinessAccount_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  businessAccount: {
    id: "businessAccount",
    accessorKey: "businessAccount",
    header: () => (
      <SortableHeader
        title="Business account"
        sortField="businessAccountName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.businessAccount && (
        <div className="inline-flex max-w-48">
          <BusinessAccountResourceLink
            data={original.businessAccount}
            withTooltip
            disabled
          />
        </div>
      ),
  },
  permissionSchema: {
    id: "permissionSchema",
    accessorKey: "permissionSchema",
    header: () => (
      <SortableHeader
        title="Permission schema"
        sortField="permissionSchemaName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.permissionSchema && (
        <div className="inline-flex max-w-48">
          <PermissionSchemaResourceLink
            data={original.permissionSchema}
            withTooltip
          />
        </div>
      ),
  },
  twinflowSchema: {
    id: "twinflowSchema",
    accessorKey: "twinflowSchema",
    header: () => (
      <SortableHeader title="Twinflow schema" sortField="twinflowSchemaName" />
    ),
    cell: ({ row: { original } }) =>
      original.twinflowSchema && (
        <div className="inline-flex max-w-48">
          <TwinFlowSchemaResourceLink
            data={original.twinflowSchema as TwinFlowSchema_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  twinClassSchema: {
    id: "twinClassSchema",
    accessorKey: "twinClassSchema",
    header: () => (
      <SortableHeader
        title="Twinclass schema"
        sortField="twinClassSchemaName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.twinClassSchema && (
        <div className="inline-flex max-w-48">
          <TwinClassSchemaResourceLink
            data={original.twinClassSchema as TwinClassSchema_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  notificationSchema: {
    id: "notificationSchema",
    accessorKey: "notificationSchema",
    header: () => (
      <SortableHeader
        title="Notification schema"
        sortField="notificationSchemaName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.notificationSchema && (
        <div className="inline-flex max-w-48">
          <NotificationSchemaResourceLink
            data={original.notificationSchema}
            withTooltip
          />
        </div>
      ),
  },
  tier: {
    id: "tier",
    accessorKey: "tier",
    header: () => <SortableHeader title="Tier" sortField="tierName" />,
    cell: ({ row: { original } }) =>
      original.tier && (
        <div className="inline-flex max-w-48">
          <TierResourceLink data={original.tier} withTooltip />
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
  attachmentsStorageUsedCount: {
    id: "attachmentsStorageUsedCount",
    accessorKey: "attachmentsStorageUsedCount",
    header: () => (
      <SortableHeader
        title="Attachments storage used count"
        sortField="attachmentsStorageUsedCount"
      />
    ),
  },
  attachmentsStorageUsedSize: {
    id: "attachmentsStorageUsedSize",
    accessorKey: "attachmentsStorageUsedSize",
    header: () => (
      <SortableHeader
        title="Attachments storage used size"
        sortField="attachmentsStorageUsedSize"
      />
    ),
  },
  twinsCount: {
    id: "twinsCount",
    accessorKey: "twinsCount",
    header: "Twins count",
  },
  activeUsersCount: {
    id: "activeUsersCount",
    accessorKey: "activeUsersCount",
    header: "Active Users Count",
  },
};

export function BusinessAccountsTable() {
  const { searchBusinessAccount } = useBusinessAccountSearch();
  const { countBusinessAccount } = useBusinessAccountCount();
  const { buildFilterFields, mapFiltersToPayload } =
    useBusinessAccountFilters();
  const router = useRouter();

  async function fetchBusinessAccounts(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<DomainBusinessAccount_DETAILED>> {
    const _filters = mapFiltersToPayload(
      filters.filters as Record<DomainBusinessAccountFilterKeys, unknown>
    );

    try {
      return await searchBusinessAccount({
        pagination,
        filters: { ..._filters },
        sort,
      });
    } catch (error) {
      toast.error("An error occured while fetching business accounts:" + error);
      throw new Error(
        "An error occured while fetching business accounts:" + error
      );
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/domain/business_account/count/v1), bound to the active filters.
  // Only the fields the endpoint can group by are offered — business account
  // itself is intentionally excluded, since it is not a groupable field.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<DomainBusinessAccountFilterKeys, unknown>
      );

      return [
        {
          key: "tier",
          label: "Tier",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countBusinessAccount({
                filters: resolved,
                groupField: "tierId",
                offset,
                limit,
              }),
            (g) => g.tierId,
            (g) => g.tier?.name,
            (g) => g.tier && <TierResourceLink data={g.tier} withTooltip />
          ),
        },
        {
          key: "permissionSchema",
          label: "Permission schema",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countBusinessAccount({
                filters: resolved,
                groupField: "permissionSchemaId",
                offset,
                limit,
              }),
            (g) => g.permissionSchemaId,
            (g) => g.permissionSchema?.name,
            (g) =>
              g.permissionSchema && (
                <PermissionSchemaResourceLink
                  data={g.permissionSchema}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "twinflowSchema",
          label: "Twinflow schema",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countBusinessAccount({
                filters: resolved,
                groupField: "twinflowSchemaId",
                offset,
                limit,
              }),
            (g) => g.twinflowSchemaId,
            (g) => g.twinflowSchema?.name,
            (g) =>
              g.twinflowSchema && (
                <TwinFlowSchemaResourceLink
                  data={g.twinflowSchema as TwinFlowSchema_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "twinClassSchema",
          label: "Twinclass schema",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countBusinessAccount({
                filters: resolved,
                groupField: "twinClassSchemaId",
                offset,
                limit,
              }),
            (g) => g.twinClassSchemaId,
            (g) => g.twinClassSchema?.name,
            (g) =>
              g.twinClassSchema && (
                <TwinClassSchemaResourceLink
                  data={g.twinClassSchema as TwinClassSchema_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "notificationSchema",
          label: "Notification schema",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countBusinessAccount({
                filters: resolved,
                groupField: "notificationSchemaId",
                offset,
                limit,
              }),
            (g) => g.notificationSchemaId,
            (g) => g.notificationSchema?.name,
            (g) =>
              g.notificationSchema && (
                <NotificationSchemaResourceLink
                  data={g.notificationSchema}
                  withTooltip
                />
              )
          ),
        },
      ];
    },
    [countBusinessAccount, mapFiltersToPayload]
  );

  return (
    <CrudDataTable
      permissionSegment="business-accounts"
      title="Domain business accounts"
      columns={[
        colDefs.id,
        colDefs.businessAccount,
        colDefs.permissionSchema,
        colDefs.twinflowSchema,
        colDefs.twinClassSchema,
        colDefs.notificationSchema,
        colDefs.tier,
        colDefs.createdAt,
        colDefs.attachmentsStorageUsedCount,
        colDefs.attachmentsStorageUsedSize,
        colDefs.twinsCount,
        colDefs.activeUsersCount,
      ]}
      fetcher={fetchBusinessAccounts}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.businessAccount,
        colDefs.permissionSchema,
        colDefs.twinflowSchema,
        colDefs.twinClassSchema,
        colDefs.notificationSchema,
        colDefs.tier,
        colDefs.createdAt,
        colDefs.attachmentsStorageUsedCount,
        colDefs.attachmentsStorageUsedSize,
        colDefs.twinsCount,
        colDefs.activeUsersCount,
      ]}
      getRowId={(row) => row.id!}
      filters={{ filtersInfo: buildFilterFields() }}
      chartGroupings={buildChartGroupings}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/business-accounts/${row.id}`)
      }
    />
  );
}
