import { TwinClass, TwinFlow } from "@/lib/api/api-types";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiContext } from "@/lib/api/api";
import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { useRouter } from "next/navigation";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import CreateTwinflowDialog from "@/app/twinclass/[twinClassId]/twin-class-twinflow-dialog";
import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { AutoFormValueType } from "@/components/auto-field";
import { TwinflowGeneral } from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-general";

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
    cell: (data) => <>{data.row.original.initialStatus?.name}</>,
  },
];

export function TwinClassTwinflows() {
  const [twinflowDialogOpen, setTwinflowDialogOpen] = useState(false);
  const api = useContext(ApiContext);
  const { twinClass, getStatusesBySearch, findStatusById } =
    useContext(TwinClassContext);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);

  async function fetchTwinflows(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pageCount: 0 };
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
          pageCount: 0,
        };
      }

      return {
        data: data.twinflowList ?? [],
        pageCount: Math.ceil(
          (data.pagination?.total ?? 0) / pagination.pageSize
        ),
      };
    } catch (e) {
      console.error("Failed to fetch twinflow", e);
      toast.error("Failed to fetch twinflow");
      return {
        data: [],
        pageCount: 0,
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
          text: "Create",
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
              getItems: getStatusesBySearch,
              getItemKey: (c) => c?.id?.toLowerCase() ?? "",
              getItemLabel: (c) => {
                let label = c?.key ?? "";
                if (c.name) label += ` (${c.name})`;
                return label;
              },
              getById: findStatusById,
              selectPlaceholder: "Select status...",
            },
          },
          onChange: () => {
            console.log("Filters changed");
            return Promise.resolve();
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
