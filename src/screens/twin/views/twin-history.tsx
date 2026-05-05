import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { toast } from "sonner";

import { useFetchHistoryV1, useHistoryFilters } from "@/entities/twin";
import {
  HistoryFilterKeys,
  HistoryV1,
  History_DETAILED,
} from "@/entities/twin/server";
import { TwinContext } from "@/features/twin";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate, isTruthy } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";

const colDefs: Record<
  keyof Pick<
    History_DETAILED,
    | "id"
    | "type"
    | "twinClassField"
    | "changeDescription"
    | "createdAt"
    | "batchId"
    | "actorUserId"
    | "machineUserId"
  >,
  ColumnDef<History_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  type: {
    id: "type",
    accessorKey: "type",
    header: "Change type",
  },

  twinClassField: {
    id: "twinClassField",
    accessorKey: "twinClassField",
    header: "Field",
    cell: ({ row: { original } }) =>
      original.twinClassField && (
        <div className="inline-flex max-w-48">
          <TwinClassFieldResourceLink
            data={original.twinClassField}
            withTooltip
          />
        </div>
      ),
  },

  changeDescription: {
    id: "changeDescription",
    accessorKey: "changeDescription",
    header: "Details",
  },

  actorUserId: {
    id: "actorUserId",
    accessorKey: "actorUserId",
    header: "Actor",
    cell: ({ row: { original } }) =>
      original.actorUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.actorUser} withTooltip />
        </div>
      ),
  },

  machineUserId: {
    id: "machineUserId",
    accessorKey: "machineUserId",
    header: "Machine",
    cell: ({ row: { original } }) =>
      original.machineUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.machineUser} withTooltip />
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

  batchId: {
    id: "batchId",
    accessorKey: "batchId",
    header: "Batch id",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
};

export function TwinHistory() {
  const { twinId } = useContext(TwinContext);
  const { fetchHistoryByTwinId } = useFetchHistoryV1();
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } = useHistoryFilters({
    enabledFilters: isTruthy(twinId)
      ? [
          "idList",
          "twinClassFieldIdList",
          "actorUserIdList",
          "typeList",
          "createdAtFrom",
          "createdAtTo",
        ]
      : undefined,
  });

  async function fetchHistory(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<HistoryV1>> {
    const _filters = mapFiltersToPayload(
      filters.filters as Record<HistoryFilterKeys, unknown>
    );

    try {
      return await fetchHistoryByTwinId({
        twinId,
        pagination,
        filters: _filters,
      });
    } catch {
      toast.error("Failed to fetch twin history");
      return { data: [], pagination: {} };
    }
  }

  return (
    <div className="mb-10">
      <CrudDataTable
        title="History"
        ref={tableRef}
        columns={[
          colDefs.id,
          colDefs.type,
          colDefs.twinClassField,
          colDefs.changeDescription,
          colDefs.actorUserId,
          colDefs.machineUserId,
          colDefs.createdAt,
          colDefs.batchId,
        ]}
        getRowId={(row) => row.id!}
        fetcher={fetchHistory}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.type,
          colDefs.twinClassField,
          colDefs.changeDescription,
          colDefs.actorUserId,
          colDefs.machineUserId,
          colDefs.createdAt,
          colDefs.batchId,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
      />
    </div>
  );
}
