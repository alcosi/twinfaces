import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

import {
  TriggerTask_DETAILED,
  useTriggerTaskSearch,
} from "@/entities/trigger-tasks";
import { TwinStatus } from "@/entities/twin-status";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { formatIntlDate } from "@/shared/libs";
import { Badge, GuidWithCopy } from "@/shared/ui";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    TriggerTask_DETAILED,
    | "id"
    | "twinId"
    | "twinTriggerId"
    | "previousTwinStatusId"
    | "createdByUserId"
    | "businessAccountId"
    | "statusId"
    | "statusDetails"
    | "createdAt"
    | "doneAt"
  >,
  ColumnDef<TriggerTask_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  twinId: {
    id: "twinId",
    accessorKey: "twinId",
    header: "Twin",
    cell: ({ row: { original } }) =>
      original.twin && (
        <div className="inline-flex max-w-48">
          <TwinResourceLink data={original.twin} withTooltip />
        </div>
      ),
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
  previousTwinStatusId: {
    accessorKey: "previousTwinStatusId",
    header: "Previous twin status",
    cell: ({ row: { original } }) =>
      original.previousTwinStatusId && (
        <div className="inline-flex max-w-48">
          <TwinClassStatusResourceLink
            data={original.previousTwinStatus as TwinStatus}
            twinClassId={original.twinId!}
            withTooltip
          />
        </div>
      ),
  },
  createdByUserId: {
    id: "createdByUserId",
    accessorKey: "createdByUserId",
    header: "Created by user",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
  businessAccountId: {
    id: "businessAccountId",
    accessorKey: "businessAccountId",
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
  statusId: {
    accessorKey: "statusId",
    header: "Twin trigger task status",
    cell: ({ row: { original } }) => (
      <Badge variant="outline">{original.statusId}</Badge>
    ),
  },
  statusDetails: {
    id: "statusDetails",
    accessorKey: "statusDetails",
    header: "Status details",
    cell: (data) => data.getValue<string>(),
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
  doneAt: {
    id: "doneAt",
    accessorKey: "doneAt",
    header: "Done at",
    cell: ({ row: { original } }) =>
      original.doneAt && formatIntlDate(original.doneAt, "datetime-local"),
  },
};

export function TriggerTasksTable() {
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTriggerTasks } = useTriggerTaskSearch();

  async function fetchData(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TriggerTask_DETAILED>> {
    try {
      return await searchTriggerTasks({
        pagination,
      });
    } catch (error) {
      toast.error("An error occured while fetching trigger tasks: " + error);
      throw new Error(
        "An error occured while fetching trigger tasks: " + error
      );
    }
  }

  return (
    <CrudDataTable
      ref={tableRef}
      title="Twin trigger tasks"
      columns={[
        colDefs.id,
        colDefs.twinId,
        colDefs.twinTriggerId,
        colDefs.previousTwinStatusId,
        colDefs.createdByUserId,
        colDefs.businessAccountId,
        colDefs.statusId,
        colDefs.statusDetails,
        colDefs.createdAt,
        colDefs.doneAt,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchData}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.twinId,
        colDefs.twinTriggerId,
        colDefs.previousTwinStatusId,
        colDefs.createdByUserId,
        colDefs.businessAccountId,
        colDefs.statusId,
        colDefs.statusDetails,
        colDefs.createdAt,
        colDefs.doneAt,
      ]}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/trigger-tasks/${row.id}`)
      }
    />
  );
}
