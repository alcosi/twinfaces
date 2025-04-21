import { ColumnDef } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { toast } from "sonner";

import { TwinLinkView } from "@/entities/link";
import { useFetchTwinLinks } from "@/entities/twin";
import { LinkResourceLink } from "@/features/link/ui";
import { TwinContext } from "@/features/twin";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";

const colDefs: Record<
  keyof Pick<
    TwinLinkView,
    "id" | "linkId" | "dstTwinId" | "createdByUserId" | "createdAt"
  >,
  ColumnDef<TwinLinkView>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  linkId: {
    id: "linkId",
    accessorKey: "linkId",
    header: "Link",
    cell: ({ row: { original } }) =>
      original.link && (
        <div className="max-w-48 inline-flex">
          <LinkResourceLink data={original.link} withTooltip />
        </div>
      ),
  },

  dstTwinId: {
    id: "dstTwinId",
    accessorKey: "dstTwinId",
    header: "Destination Twin",
    cell: ({ row: { original } }) =>
      original.dstTwin && (
        <div className="max-w-48 inline-flex">
          <TwinResourceLink data={original.dstTwin} withTooltip />
        </div>
      ),
  },

  createdByUserId: {
    id: "createdByUserId",
    accessorKey: "createdByUserId",
    header: "Created by User",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function TwinLinks() {
  const { twin } = useContext(TwinContext);
  const tableRefForward = useRef<DataTableHandle>(null);
  const tableRefBackward = useRef<DataTableHandle>(null);
  const { fetchTwinLinksById } = useFetchTwinLinks();

  async function fetchLinks(
    type: "forward" | "backward"
  ): Promise<PagedResponse<TwinLinkView>> {
    if (!twin?.id) {
      toast.error("Twin ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const response = await fetchTwinLinksById({ twinId: twin.id, type });
      const { data } = response;

      return { data, pagination: {} };
    } catch (e) {
      toast.error(`Failed to fetch twin ${type} links`);
      return { data: [], pagination: {} };
    }
  }

  return (
    <>
      <CrudDataTable
        title="Forward Links"
        ref={tableRefForward}
        columns={[
          colDefs.id,
          colDefs.linkId,
          colDefs.dstTwinId,
          colDefs.createdByUserId,
          colDefs.createdAt,
        ]}
        getRowId={(row) => row.id!}
        fetcher={() => fetchLinks("forward")}
        disablePagination={true}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.linkId,
          colDefs.dstTwinId,
          colDefs.createdByUserId,
          colDefs.createdAt,
        ]}
      />

      <CrudDataTable
        title="Backward Links"
        ref={tableRefBackward}
        columns={[
          colDefs.id,
          colDefs.linkId,
          { ...colDefs.dstTwinId, header: "Source Twin" },
          colDefs.createdByUserId,
          colDefs.createdAt,
        ]}
        getRowId={(row) => row.id!}
        fetcher={() => fetchLinks("backward")}
        disablePagination={true}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.linkId,
          colDefs.dstTwinId,
          colDefs.createdByUserId,
          colDefs.createdAt,
        ]}
      />
    </>
  );
}
