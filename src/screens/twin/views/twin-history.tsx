import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { toast } from "sonner";

import { useFetchHistoryV1 } from "@/entities/twin";
import { HistoryV1 } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { TwinContext } from "@/features/twin";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";

const colDefs: Record<
  keyof Pick<
    HistoryV1,
    | "id"
    | "type"
    | "fieldName"
    | "changeDescription"
    | "actorUserId"
    | "createdAt"
    | "batchId"
  >,
  ColumnDef<HistoryV1>
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

  fieldName: {
    id: "fieldName",
    accessorKey: "fieldName",
    header: "Field",
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
      original.twin?.authorUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink
            data={original.twin?.authorUser as User}
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

  async function fetchHistory(
    pagination: PaginationState
  ): Promise<PagedResponse<HistoryV1>> {
    try {
      const response = await fetchHistoryByTwinId({
        twinId,
        pagination,
      });

      return response;
    } catch (e) {
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
          colDefs.id!,
          colDefs.type!,
          colDefs.fieldName!,
          colDefs.changeDescription!,
          colDefs.actorUserId!,
          colDefs.createdAt!,
          colDefs.batchId!,
        ]}
        getRowId={(row) => row.id!}
        fetcher={fetchHistory}
        defaultVisibleColumns={[
          colDefs.id!,
          colDefs.type!,
          colDefs.fieldName!,
          colDefs.changeDescription!,
          colDefs.actorUserId!,
          colDefs.createdAt!,
          colDefs.batchId!,
        ]}
      />
    </div>
  );
}
