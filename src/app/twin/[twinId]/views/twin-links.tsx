import { TwinLinkView } from "@/entities/twin";
import { ApiContext, PagedResponse } from "@/shared/api";
import {
  CrudDataTable,
  FiltersState,
} from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { LoadingOverlay } from "@/shared/ui/loading";
import { ShortGuidWithCopy } from "@/shared/ui/short-guid";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { toast } from "sonner";
import { TwinContext } from "../twin-context";

export function TwinLinks() {
  const api = useContext(ApiContext);
  const { twin } = useContext(TwinContext);
  const tableRefForward = useRef<DataTableHandle>(null);
  const tableRefBackward = useRef<DataTableHandle>(null);

  const columns: ColumnDef<TwinLinkView>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "linkId",
      header: "Link ID",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "dstTwinId",
      header: "Destination Twin",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "createdByUserId",
      header: "Created by User",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row: { original } }) =>
        original.createdAt
          ? new Date(original.createdAt).toLocaleDateString()
          : "",
    },
  ];

  async function fetchLinks(
    type: "forward" | "backward",
    _: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinLinkView>> {
    if (!twin?.id) {
      toast.error("Twin ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const response = await api.twin.searchLinks({ twinId: twin.id });
      const data = response.data;

      if (!data || data.status != 0) {
        console.error("failed to fetch twin links", data);
        let message = "Failed to load twin links";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pagination: {} };
      }

      const linksData = data?.twin?.links
        ? Object.values(
            data.twin.links[
              type === "forward" ? "forwardLinks" : "backwardLinks"
            ] || []
          )
        : [];

      return {
        data: linksData,
        pagination: {},
      };
    } catch (e) {
      console.error(`Failed to fetch twin ${type} links`, e);
      toast.error(`Failed to fetch twin ${type} links`);
      return { data: [], pagination: {} };
    }
  }

  if (!twin) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <div className="mb-10">
        <CrudDataTable
          ref={tableRefForward}
          title="Forward Links"
          columns={columns}
          getRowId={(row) => row.id!}
          fetcher={(paginationState, filters) =>
            fetchLinks("forward", paginationState, filters)
          }
          // createButton={{
          //   enabled: true,
          //   onClick: createLink,
          // }}
          disablePagination={true}
          pageSizes={[10, 20, 50]}
          customizableColumns={{
            enabled: true,
            defaultVisibleKeys: [
              "id",
              "linkId",
              "dstTwinId",
              "createdByUserId",
              "createdAt",
            ],
          }}
        />
      </div>

      <CrudDataTable
        ref={tableRefBackward}
        title="Backward Links"
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={(paginationState, filters) =>
          fetchLinks("backward", paginationState, filters)
        }
        // createButton={{
        //   enabled: true,
        //   onClick: createLink,
        // }}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "id",
            "linkId",
            "dstTwinId",
            "createdByUserId",
            "createdAt",
          ],
        }}
      />
    </>
  );
}
