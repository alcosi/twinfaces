import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { toast } from "sonner";

import {
  StatusTrigger_DETAILED,
  useStatusTriggerSearch,
} from "@/entities/status-trigger";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    StatusTrigger_DETAILED,
    | "id"
    | "twinStatusId"
    | "incomingElseOutgoing"
    | "order"
    | "twinTriggerId"
    | "async"
    | "active"
  >,
  ColumnDef<StatusTrigger_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  twinStatusId: {
    id: "twinStatusId",
    accessorKey: "twinStatusId",
    header: "Twin status",
    cell: ({ row: { original } }) =>
      original.twinStatus && (
        <div className="inline-flex max-w-48">
          <TwinClassStatusResourceLink data={original.twinStatus} withTooltip />
        </div>
      ),
  },
  incomingElseOutgoing: {
    id: "incomingElseOutgoing",
    accessorKey: "incomingElseOutgoing",
    header: "Incoming else outgoing",
    cell: (data) => (data.getValue() ? "Incoming" : "Outgoing"),
  },
  order: {
    id: "order",
    accessorKey: "order",
    header: "Order",
  },
  twinTriggerId: {
    id: "twinTriggerId",
    accessorKey: "twinTriggerId",
    header: "Twin trigger",
    cell: ({ row: { original } }) =>
      original.twinTrigger && (
        <div className="inline-flex max-w-48">
          <TwinTriggerResourceLink data={original.twinTrigger} withTooltip />
        </div>
      ),
  },
  async: {
    id: "async",
    accessorKey: "async",
    header: "Async",
    cell: (data) => data.getValue() && <Check />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function StatusTriggersTable({
  twinStatusId,
}: {
  twinStatusId?: string;
}) {
  const { searchStatusTriggers } = useStatusTriggerSearch();

  async function fetchStatusTriggers(
    pagination: PaginationState
  ): Promise<PagedResponse<StatusTrigger_DETAILED>> {
    try {
      return await searchStatusTriggers({
        pagination,
        filters: {
          ...(twinStatusId ? { twinStatusIdList: [twinStatusId] } : {}),
        },
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching twin status triggers: " + error
      );
      throw error;
    }
  }

  return (
    <CrudDataTable
      title="Status triggers"
      columns={[
        colDefs.id,
        colDefs.twinStatusId,
        colDefs.incomingElseOutgoing,
        colDefs.order,
        colDefs.twinTriggerId,
        colDefs.async,
        colDefs.active,
      ]}
      fetcher={fetchStatusTriggers}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.twinStatusId,
        colDefs.incomingElseOutgoing,
        colDefs.order,
        colDefs.twinTriggerId,
        colDefs.async,
        colDefs.active,
      ]}
    />
  );
}
