import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  STATUS_TRIGGER_SCHEMA,
  StatusTriggerFilterKeys,
  StatusTrigger_DETAILED,
  useStatusTriggerCreate,
  useStatusTriggerFilters,
  useStatusTriggerSearch,
} from "@/entities/status-trigger";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import { StatusTriggerFormFields } from "./form-fields";

type StatusTriggerFormValues = z.infer<typeof STATUS_TRIGGER_SCHEMA>;

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
  const router = useRouter();
  const { searchStatusTriggers } = useStatusTriggerSearch();
  const { createStatusTrigger } = useStatusTriggerCreate();
  const { buildFilterFields, mapFiltersToPayload } = useStatusTriggerFilters({
    enabledFilters: twinStatusId
      ? [
          "idList",
          "incomingElseOutgoing",
          "twinTriggerIdList",
          "active",
          "async",
        ]
      : undefined,
  });

  const statusTriggerForm = useForm<StatusTriggerFormValues>({
    resolver: zodResolver(STATUS_TRIGGER_SCHEMA),
    defaultValues: {
      incomingElseOutgoing: false,
      order: 0,
      active: false,
      async: false,
    },
  });

  async function fetchStatusTriggers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<StatusTrigger_DETAILED>> {
    const _filters = mapFiltersToPayload(
      filters.filters as Record<StatusTriggerFilterKeys, unknown>
    );

    try {
      return await searchStatusTriggers({
        pagination,
        filters: {
          ..._filters,
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

  async function handleCreateSubmit(formValues: StatusTriggerFormValues) {
    try {
      await createStatusTrigger({
        body: {
          twinStatusTriggers: [
            {
              twinStatusId: formValues.twinStatusId,
              incomingElseOutgoing: formValues.incomingElseOutgoing,
              order: formValues.order,
              twinTriggerId: formValues.twinTriggerId,
              async: formValues.async,
              active: formValues.active,
            },
          ],
        },
      });

      toast.success("Status trigger created successfully");
    } catch {
      toast.error("Failed to create status trigger");
    }
  }

  return (
    <CrudDataTable
      title="Status triggers"
      columns={[
        colDefs.id,
        ...(twinStatusId ? [] : [colDefs.twinStatusId]),
        colDefs.incomingElseOutgoing,
        colDefs.order,
        colDefs.twinTriggerId,
        colDefs.async,
        colDefs.active,
      ]}
      fetcher={fetchStatusTriggers}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/status-triggers/${row.id}`)
      }
      defaultVisibleColumns={[
        colDefs.id,
        ...(twinStatusId ? [] : [colDefs.twinStatusId]),
        colDefs.incomingElseOutgoing,
        colDefs.order,
        colDefs.twinTriggerId,
        colDefs.async,
        colDefs.active,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      dialogForm={statusTriggerForm}
      onCreateSubmit={handleCreateSubmit}
      renderFormFields={() => (
        <StatusTriggerFormFields control={statusTriggerForm.control} />
      )}
    />
  );
}
