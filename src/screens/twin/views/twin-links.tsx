import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useCallback, useContext, useMemo, useRef } from "react";
import { toast } from "sonner";

import { TwinLinkView } from "@/entities/link";
import { useFetchTwinLinks } from "@/entities/twin";
import { LinkResourceLink } from "@/features/link/ui";
import { TwinContext } from "@/features/twin";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";

export function TwinLinks() {
  const { twin } = useContext(TwinContext);
  const tableRefForward = useRef<DataTableHandle>(null);
  const tableRefBackward = useRef<DataTableHandle>(null);
  const { fetchTwinLinksById } = useFetchTwinLinks();

  const fetchLinks = useCallback(
    async (
      type: "forward" | "backward"
    ): Promise<PagedResponse<TwinLinkView>> => {
      if (!twin?.id) {
        toast.error("Twin ID is missing");
        return { data: [], pagination: {} };
      }

      try {
        const { data } = await fetchTwinLinksById({ twinId: twin.id, type });
        return { data, pagination: {} };
      } catch {
        toast.error(`Failed to fetch twin ${type} links`);
        return { data: [], pagination: {} };
      }
    },
    [twin?.id, fetchTwinLinksById]
  );

  const fetchForwardLinks = useCallback(
    () => fetchLinks("forward"),
    [fetchLinks]
  );

  const fetchBackwardLinks = useCallback(
    () => fetchLinks("backward"),
    [fetchLinks]
  );

  const colDefs: Record<
    keyof Pick<
      TwinLinkView,
      "id" | "linkId" | "dstTwinId" | "createdByUserId" | "createdAt"
    >,
    ColumnDef<TwinLinkView>
  > = useMemo(
    () => ({
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
            <div className="inline-flex max-w-48">
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
            <div className="inline-flex max-w-48">
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
            <div className="inline-flex max-w-48">
              <UserResourceLink data={original.createdByUser} withTooltip />
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
    }),
    []
  );

  const pageSizes = useMemo(() => [10, 25, 50], []);
  const forwardLinksColumns = useMemo<ColumnDef<TwinLinkView>[]>(
    () => [
      colDefs.id,
      colDefs.linkId,
      colDefs.dstTwinId,
      colDefs.createdByUserId,
      colDefs.createdAt,
    ],
    []
  );

  const defaultForwardLinksColumns = useMemo<ColumnDef<TwinLinkView>[]>(
    () => [
      colDefs.id,
      colDefs.linkId,
      colDefs.dstTwinId,
      colDefs.createdByUserId,
      colDefs.createdAt,
    ],
    []
  );

  const backwardLinksColumns = useMemo<ColumnDef<TwinLinkView>[]>(
    () => [
      colDefs.id,
      colDefs.linkId,
      { ...colDefs.dstTwinId, header: "Source Twin" },
      colDefs.createdByUserId,
      colDefs.createdAt,
    ],
    []
  );

  const defaultBackwardLinksColumns = useMemo<ColumnDef<TwinLinkView>[]>(
    () => [
      colDefs.id,
      colDefs.linkId,
      colDefs.dstTwinId,
      colDefs.createdByUserId,
      colDefs.createdAt,
    ],
    []
  );

  return (
    <>
      <CrudDataTable
        title="Forward Links"
        ref={tableRefForward}
        columns={forwardLinksColumns}
        pageSizes={pageSizes}
        getRowId={(row) => row.id!}
        fetcher={fetchForwardLinks}
        disablePagination={true}
        defaultVisibleColumns={defaultForwardLinksColumns}
      />

      <CrudDataTable
        title="Backward Links"
        ref={tableRefBackward}
        columns={backwardLinksColumns}
        pageSizes={pageSizes}
        getRowId={(row) => row.id!}
        fetcher={fetchBackwardLinks}
        disablePagination={true}
        defaultVisibleColumns={defaultBackwardLinksColumns}
      />
    </>
  );
}
