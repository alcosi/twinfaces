import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

import { Tier_DETAILED, useTierFilters, useTierSearch } from "@/entities/tier";
import { TwinClassSchema_DETAILED } from "@/entities/twin-class-schema";
import { TwinFlowSchema_DETAILED } from "@/entities/twinFlowSchema";
import { PermissionSchemaResourceLink } from "@/features/permission-schema/ui";
import { TwinClassSchemaResourceLink } from "@/features/twin-class-schema/ui";
import { TwinFlowSchemaResourceLink } from "@/features/twin-flow-schema/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    Tier_DETAILED,
    | "id"
    | "name"
    | "custom"
    | "permissionSchemaId"
    | "twinflowSchemaId"
    | "twinClassSchemaId"
    | "attachmentsStorageQuotaCount"
    | "attachmentsStorageQuotaSize"
    | "userCountQuota"
    | "description"
    | "createdAt"
  >,
  ColumnDef<Tier_DETAILED>
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

  custom: {
    id: "custom",
    accessorKey: "custom",
    header: "Custom",
    cell: (data) => data.getValue() && <Check />,
  },

  permissionSchemaId: {
    id: "permissionSchemaId",
    accessorKey: "permissionSchemaId",
    header: "Permission schema",
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

  twinflowSchemaId: {
    id: "twinflowSchemaId",
    accessorKey: "twinflowSchemaId",
    header: "Twinflow schema",
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

  twinClassSchemaId: {
    id: "twinClassSchemaId",
    accessorKey: "twinClassSchemaId",
    header: "Class schema",
    cell: ({ row: { original } }) =>
      original.twinClassSchema && (
        <div className="inline-flex max-w-48">
          <TwinClassSchemaResourceLink
            data={original.twinClassSchema as TwinClassSchema_DETAILED}
            withTooltip
            disabled
          />
        </div>
      ),
  },

  attachmentsStorageQuotaCount: {
    id: "attachmentsStorageQuotaCount",
    accessorKey: "attachmentsStorageQuotaCount",
    header: "Attachments count quota",
  },

  attachmentsStorageQuotaSize: {
    id: "attachmentsStorageQuotaSize",
    accessorKey: "attachmentsStorageQuotaSize",
    header: "Attachments size quota",
  },

  userCountQuota: {
    id: "userCountQuota",
    accessorKey: "userCountQuota",
    header: "User count quota",
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

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
};

export function TiersTable() {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { searchTiers } = useTierSearch();
  const { buildFilterFields, mapFiltersToPayload } = useTierFilters();

  async function fetchTiers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Tier_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchTiers({
        pagination,
        filters: _filters,
      });

      return response;
    } catch {
      toast.error("Failed to fetch tiers");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      title="Tiers"
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.name,
        colDefs.custom,
        colDefs.permissionSchemaId,
        colDefs.twinflowSchemaId,
        colDefs.twinClassSchemaId,
        colDefs.attachmentsStorageQuotaCount,
        colDefs.attachmentsStorageQuotaSize,
        colDefs.userCountQuota,
        colDefs.description,
        colDefs.createdAt,
      ]}
      fetcher={fetchTiers}
      getRowId={(row) => row.id!}
      onRowClick={(row) => router.push(`/${PlatformArea.core}/tiers/${row.id}`)}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.custom,
        colDefs.permissionSchemaId,
        colDefs.twinflowSchemaId,
        colDefs.twinClassSchemaId,
        colDefs.attachmentsStorageQuotaCount,
        colDefs.attachmentsStorageQuotaSize,
        colDefs.userCountQuota,
        colDefs.description,
        colDefs.createdAt,
      ]}
    />
  );
}
