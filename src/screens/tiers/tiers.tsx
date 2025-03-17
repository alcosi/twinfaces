"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { PermissionSchemaResourceLink } from "@/entities/permission-schema";
import { Tier_DETAILED, useTierFilters, useTierSearch } from "@/entities/tier";
import {
  TwinClassSchemaResourceLink,
  TwinClassSchema_DETAILED,
} from "@/entities/twin-class-schema";
import {
  TwinFlowSchemaResourceLink,
  TwinFlowSchema_DETAILED,
} from "@/entities/twinFlowSchema";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";

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
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex">
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
        <div className="max-w-48 inline-flex">
          <TwinClassSchemaResourceLink
            data={original.twinClassSchema as TwinClassSchema_DETAILED}
            withTooltip
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
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function Tiers() {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchTiers } = useTierSearch();
  const { buildFilterFields, mapFiltersToPayload } = useTierFilters();

  useEffect(() => {
    setBreadcrumbs([{ label: "Tiers", href: "/workspace/tiers" }]);
  }, [setBreadcrumbs]);

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
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
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
      onRowClick={(row) => router.push(`/workspace/tiers/${row.id}`)}
      pageSizes={[10, 20, 50]}
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
