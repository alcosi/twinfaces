"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  DomainBusinessAccountFilterKeys,
  DomainBusinessAccount_DETAILED,
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
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

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
  permissionSchema: {
    id: "permissionSchema",
    accessorKey: "permissionSchema",
    header: "Permission scheme",
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
    header: "Twinflow scheme",
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
    header: "Twinclass scheme",
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
    header: "Notification scheme",
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
    header: "Tier",
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
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
  attachmentsStorageUsedCount: {
    id: "attachmentsStorageUsedCount",
    accessorKey: "attachmentsStorageUsedCount",
    header: "Attachments storage used count",
  },
  attachmentsStorageUsedSize: {
    id: "attachmentsStorageUsedSize",
    accessorKey: "attachmentsStorageUsedSize",
    header: "Attachments storage used size",
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

export function BusinessAccountsScreen() {
  const { searchBusinessAccount } = useBusinessAccountSearch();
  const { buildFilterFields, mapFiltersToPayload } =
    useBusinessAccountFilters();

  async function fetchBusinessAccounts(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<DomainBusinessAccount_DETAILED>> {
    const _filters = mapFiltersToPayload(
      filters.filters as Record<DomainBusinessAccountFilterKeys, unknown>
    );

    try {
      return await searchBusinessAccount({
        pagination,
        filters: { ..._filters },
      });
    } catch (error) {
      toast.error("An error occured while fetching business accounts:" + error);
      throw new Error(
        "An error occured while fetching business accounts:" + error
      );
    }
  }

  return (
    <CrudDataTable
      title="Busines accounts"
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
    />
  );
}
