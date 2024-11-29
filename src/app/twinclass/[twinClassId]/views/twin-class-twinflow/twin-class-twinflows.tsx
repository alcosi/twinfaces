import { AutoFormValueType } from "@/components/auto-field";
import { TwinClassContext } from "@/entities/twinClass";
import { TwinFlow } from "@/entities/twinFlow";
import {
  TwinClassStatusResourceLink,
  TwinStatus,
  useTwinStatusSelectAdapter,
} from "@/entities/twinStatus";
import { ApiContext, PagedResponse } from "@/shared/api";
import {
  CrudDataTable,
  FiltersState,
} from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { ShortGuidWithCopy } from "@/shared/ui/short-guid";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import CreateTwinflowDialog from "./twin-class-twinflow-dialog";

const columns: ColumnDef<TwinFlow>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => <ShortGuidWithCopy value={data.row.original.id} />,
  },
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "initialStatus",
    header: "Initial status",
    cell: ({ row: { original } }) =>
      original.initialStatus && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.initialStatus as TwinStatus}
            twinClassId={original.twinClassId!}
            withTooltip
          />
        </div>
      ),
  },
];

export function TwinClassTwinflows() {
  const [twinflowDialogOpen, setTwinflowDialogOpen] = useState(false);
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const sAdapter = useTwinStatusSelectAdapter();
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);

  async function fetchTwinflows(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinFlow>> {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const { data, error } = await api.twinflow.search({
        twinClassId: twinClass.id!,
        pagination,
        nameFilter: filters?.filters["name"] as string,
        descriptionFilter: filters?.filters["description"] as string,
        initialStatusFilter: filters?.filters["initialStatus"] as string,
      });

      if (error) {
        console.error("failed to fetch twinflows", error);
        toast.error("Failed to fetch twinflows");
        return {
          data: [],
          pagination: {},
        };
      }

      return {
        data: data.twinflowList ?? [],
        pagination: data.pagination ?? {},
      };
    } catch (e) {
      console.error("Failed to fetch twinflow", e);
      toast.error("Failed to fetch twinflow");
      return {
        data: [],
        pagination: {},
      };
    }
  }

  function openCreateTwinflow() {
    setTwinflowDialogOpen(true);
  }

  if (!twinClass) {
    console.error("TwinClassFields: no twin class");
    return;
  }

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={fetchTwinflows}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) =>
          router.push(`/twinclass/${row.twinClassId}/twinflow/${row.id}`)
        }
        createButton={{
          enabled: true,
          onClick: openCreateTwinflow,
          text: "Create Twinflow",
        }}
        // search={{enabled: true, placeholder: 'Search by key...'}}
        filters={{
          filtersInfo: {
            name: {
              type: AutoFormValueType.string,
              label: "Name",
            },
            abstract: {
              type: AutoFormValueType.boolean,
              label: "Abstract",
              hasIndeterminate: true,
              defaultValue: "indeterminate",
            },
            initialStatusId: {
              type: AutoFormValueType.combobox,
              label: "Initial status",
              getById: sAdapter.getById,
              getItems: sAdapter.getItems,
              getItemKey: (i) => sAdapter.getItemKey(i as TwinStatus),
              getItemLabel: (i) => sAdapter.getItemLabel(i as TwinStatus),
              selectPlaceholder: "Select status...",
            },
          },
        }}
      />
      <CreateTwinflowDialog
        open={twinflowDialogOpen}
        onOpenChange={setTwinflowDialogOpen}
        twinClassId={twinClass.id!}
        onSuccess={tableRef.current?.refresh}
      />
    </>
  );
}
