import { ImageWithFallback } from "@/components/image-with-fallback";
import { TwinClassContext, useFetchTwinClassById } from "@/entities/twinClass";
import { TwinClassStatusResourceLink, TwinStatus } from "@/entities/twinStatus";
import { isFalsy } from "@/shared/libs";
import { ColorTile } from "@/shared/ui";
import { CrudDataTable } from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { ShortGuidWithCopy } from "@/shared/ui/short-guid";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { ColumnDef } from "@tanstack/table-core";
import { Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";
import CreateEditTwinStatusDialog from "./twin-status-dialog";
import { PagedResponse } from "@/shared/api";

function buildColumnDefs(twinClassId: string) {
  const colDefs: ColumnDef<TwinStatus>[] = [
    {
      accessorKey: "logo",
      header: "Logo",
      cell: (data) => {
        const value = data.row.original.logo;
        return (
          <ImageWithFallback
            src={value as string}
            alt={value as string}
            fallbackContent={<Unplug />}
            width={32}
            height={32}
            className="text-[0]"
          />
        );
      },
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "key",
      header: "Key",
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row: { original } }) => (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original}
            twinClassId={twinClassId}
            withTooltip
          />
        </div>
      ),
    },
    {
      accessorKey: "backgroundColor",
      header: "Background Color",
      cell: (data) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <ColorTile color={data.getValue<string>()} />
            </TooltipTrigger>
            <TooltipContent>{data.getValue<string>()}</TooltipContent>
          </Tooltip>
        );
      },
    },
    {
      accessorKey: "fontColor",
      header: "Font Color",
      cell: (data) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <ColorTile color={data.getValue<string>()} />
            </TooltipTrigger>
            <TooltipContent>{data.getValue<string>()}</TooltipContent>
          </Tooltip>
        );
      },
    },
  ];

  return colDefs;
}

export function TwinClassStatuses() {
  const router = useRouter();
  const { twinClass, fetchClassData } = useContext(TwinClassContext);
  const tableRef = useRef<DataTableHandle>(null);
  const [createEditStatusDialogOpen, setCreateEditStatusDialogOpen] =
    useState<boolean>(false);
  const [editedStatus, setEditedStatus] = useState<TwinStatus | null>(null);
  const { fetchTwinClassById } = useFetchTwinClassById();

  async function fetchStatuses(): Promise<PagedResponse<TwinStatus>> {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const response = await fetchTwinClassById({
        id: twinClass.id,
        query: {
          showTwinClassMode: "SHORT",
          // showTwin2TwinClassMode: 'SHORT',
          showTwin2StatusMode: "DETAILED",
          showTwinClass2StatusMode: "DETAILED",
        },
      });

      const data = response.data;
      if (!data || data.status != 0) {
        console.error("failed to fetch twin class fields", data);
        let message = "Failed to load twin class fields";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pagination: {} };
      }

      const values = Object.values(data.twinClass?.statusMap ?? {});
      return {
        data: values,
        pagination: {},
      };
    } catch (e) {
      console.error("exception while fetching twin class fields", e);
      toast.error("Failed to fetch twin class fields");
      return { data: [], pagination: {} };
    }
  }

  function createStatus() {
    setEditedStatus(null);
    setCreateEditStatusDialogOpen(true);
  }

  function onChangeSuccess() {
    fetchClassData();
    tableRef.current?.refresh();
  }

  if (isFalsy(twinClass)) {
    console.error("TwinClassFields: no twin class");
    return;
  }

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        columns={buildColumnDefs(twinClass.id!)}
        getRowId={(row) => row.key!}
        fetcher={fetchStatuses}
        createButton={{
          enabled: true,
          onClick: createStatus,
        }}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) =>
          router.push(`/twinclass/${twinClass!.id!}/twinStatus/${row.id}`)
        }
      />

      <CreateEditTwinStatusDialog
        open={createEditStatusDialogOpen}
        twinClassId={twinClass.id!}
        status={editedStatus}
        onOpenChange={setCreateEditStatusDialogOpen}
        onSuccess={onChangeSuccess}
      />
    </>
  );
}
