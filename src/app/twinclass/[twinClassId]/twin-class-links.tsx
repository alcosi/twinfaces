import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { LoadingOverlay } from "@/components/base/loading";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { TwinClassLinkDialog } from "@/entities/twinClassLink/components/twin-link-dialog";
import { ApiContext } from "@/lib/api/api";
import { TwinClassLink } from "@/lib/api/api-types";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";

type LinkDialogState = {
  isOpen: boolean;
  srcTwinClassId?: string;
  dstTwinClassId?: string;
};

export function TwinClassLinks() {
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const tableRefForward = useRef<DataTableHandle>(null);
  const tableRefBackward = useRef<DataTableHandle>(null);

  const [dialogState, setDialogState] = useState<LinkDialogState>({
    isOpen: false,
  });

  const columns: ColumnDef<TwinClassLink>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "dstTwinClassId",
      header: "Destination Twin Class",
      cell: ({ row: { original } }) => (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.dstTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "linkStrengthId",
      header: "Link Strength",
    },
  ];

  async function fetchLinks(
    type: "forward" | "backward",
    _: PaginationState,
    filters: FiltersState
  ) {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pageCount: 0 };
    }

    try {
      const response = await api.twinClassLink.getLinks({
        twinClassId: twinClass.id,
      });
      const data = response.data;

      if (!data || data.status != 0) {
        console.error("failed to fetch twin class links", data);
        let message = "Failed to load twin class links";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pageCount: 0 };
      }

      return {
        data:
          type === "forward"
            ? Object.values(data.forwardLinkMap || {})
            : Object.values(data.backwardLinkMap || {}),
        pageCount: 0,
      };
    } catch (e) {
      console.error(`Failed to fetch twin class ${type} links`, e);
      toast.error(`Failed to fetch twin class ${type} links`);
      return { data: [], pageCount: 0 };
    }
  }

  if (!twinClass) {
    return <LoadingOverlay />;
  }

  const handleCreateLink = (isForward: boolean) => {
    setDialogState({
      isOpen: true,
      srcTwinClassId: isForward ? twinClass.id : undefined,
      dstTwinClassId: isForward ? undefined : twinClass.id,
    });
  };

  return (
    <>
      <CrudDataTable
        className="mb-10"
        ref={tableRefForward}
        title="Forward Links"
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={(paginationState, filters) =>
          fetchLinks("forward", paginationState, filters)
        }
        createButton={{
          enabled: true,
          onClick: () => handleCreateLink(true),
        }}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "id",
            "linkStrengthId",
            "name",
            "type",
            "dstTwinClassId",
          ],
        }}
      />

      <CrudDataTable
        ref={tableRefBackward}
        title="Backward Links"
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={(paginationState, filters) =>
          fetchLinks("backward", paginationState, filters)
        }
        createButton={{
          enabled: true,
          onClick: () => handleCreateLink(false),
        }}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "id",
            "linkStrengthId",
            "name",
            "type",
            "dstTwinClassId",
          ],
        }}
      />

      {twinClass?.id && (
        <TwinClassLinkDialog
          open={dialogState.isOpen}
          onOpenChange={(open) => {
            setDialogState({ isOpen: open });
          }}
          srcTwinClassId={dialogState.srcTwinClassId}
          dstTwinClassId={dialogState.dstTwinClassId}
          onSuccess={() => {
            if (dialogState.srcTwinClassId) {
              tableRefForward.current?.refresh();
            }
            if (dialogState.dstTwinClassId) {
              tableRefBackward.current?.refresh();
            }
            setDialogState({ isOpen: false });
          }}
        />
      )}
    </>
  );
}
