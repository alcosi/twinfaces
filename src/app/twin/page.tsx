"use client";

import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import {
  buildFilters,
  FilterFields,
  FILTERS,
  hydrateTwinFromMap,
  Twin,
  TwinResourceLink,
} from "@/entities/twin";
import { TwinClassResourceLink } from "@/entities/twinClass";
import {
  TwinClassStatus,
  TwinClassStatusResourceLink,
} from "@/entities/twinClassStatus";
import { User, UserResourceLink } from "@/entities/user";
import { ApiContext } from "@/shared/api";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { toast } from "sonner";

type FetchDataResponse = {
  data: Twin[];
  pageCount: number;
};

const columns: ColumnDef<Twin>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinResourceLink data={original} withTooltip />
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "statusId",
    header: "Status",
    cell: ({ row: { original } }) =>
      original.status && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.status as TwinClassStatus}
            withTooltip
          />
        </div>
      ),
  },
  {
    accessorKey: "authorUserId",
    header: "Author",
    cell: ({ row: { original } }) =>
      original.authorUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.authorUser as User} withTooltip />
        </div>
      ),
  },
  {
    accessorKey: "assignerUserId",
    header: "Assigner",
    cell: ({ row: { original } }) =>
      original.assignerUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.assignerUser as User} withTooltip />
        </div>
      ),
  },
  {
    accessorKey: "twinClassId",
    header: "Twin Class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink data={original.twinClass} withTooltip />
        </div>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt
        ? new Date(original.createdAt).toLocaleDateString()
        : "",
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

export default function TwinsPage() {
  const api = useContext(ApiContext);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);

  async function fetchData(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<FetchDataResponse> {
    try {
      const { data, error } = await api.twin.search({
        pagination,
        search: filters?.search,
        filters: buildFilters(filters),
      });

      if (error) {
        console.error("failed to fetch twins", error);
        toast.error("Failed to fetch twins");
        return {
          data: [],
          pageCount: 0,
        };
      }

      return {
        data:
          data?.twinList?.map((dto) =>
            hydrateTwinFromMap(dto, data.relatedObjects)
          ) ?? [],
        pageCount: Math.ceil(
          (data.pagination?.total ?? 0) / pagination.pageSize
        ),
      };
    } catch (e) {
      console.error("Exception when fetching twins", e);
      toast.error("Failed to fetch twins");
      return {
        data: [],
        pageCount: 0,
      };
    }
  }

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={fetchData}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) => router.push(`/twin/${row.id}`)}
        createButton={{
          enabled: true,
          text: "Create",
        }}
        filters={{
          filtersInfo: {
            [FilterFields.twinIdList]: FILTERS[FilterFields.twinIdList],
            [FilterFields.twinNameLikeList]:
              FILTERS[FilterFields.twinNameLikeList],
            [FilterFields.statusIdList]: FILTERS[FilterFields.statusIdList],
            [FilterFields.assignerUserIdList]:
              FILTERS[FilterFields.assignerUserIdList],
            [FilterFields.twinClassIdList]:
              FILTERS[FilterFields.twinClassIdList],
          },
          onChange: () => {
            console.log("Filters changed");
            return Promise.resolve();
          },
        }}
        customizableColumns={{
          enabled: true,
          defaultVisibleKeys: [
            "name",
            "statusId",
            "authorUserId",
            "assignerUserId",
            "twinClassId",
          ],
        }}
      />
    </>
  );
}
