"use client";

import { toast } from "sonner";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { useContext, useRef, useState } from "react";
import { TwinBase } from "@/lib/api/api-types";
import { ApiContext } from "@/lib/api/api";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { useRouter } from "next/navigation";
import { buildFilters, FilterFields, FILTERS } from "@/entities/twin";
import { TwinResourceLink } from "@/entities/twin/components/resource-link/resource-link";
import { TwinClassResourceLink } from "@/entities/twinClass";

type FetchDataResponse = {
  data: TwinBase[];
  pageCount: number;
};

const columns: ColumnDef<TwinBase>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinResourceLink data={original} withTooltip />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
  {
    accessorKey: "authorUserId",
    header: "Author User Id",
    cell: (data) => (
      <ShortGuidWithCopy value={data.row.original.authorUserId} />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "assignerUserId",
    header: "Assigner User Id",
    cell: (data) => (
      <ShortGuidWithCopy value={data.row.original.assignerUserId} />
    ),
  },
  {
    accessorKey: "twinClassId",
    header: "Twin Class Id",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinClassResourceLink
          data={{
            id: original.twinClassId,
          }}
          withTooltip
        />
      </div>
    ),
  },
];

export default function Twin() {
  const [classDialogOpen, setClassDialogOpen] = useState(false);

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
        data: data?.twinList ?? [],
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

  function openCreateClass() {
    setClassDialogOpen(true);
  }

  return (
    <main className={"p-8 lg:flex lg:justify-center flex-col mx-auto"}>
      <div className="w-0 flex-0 lg:w-16" />

      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={fetchData}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) => router.push(`/twin/${row.id}`)}
        createButton={{
          enabled: true,
          onClick: openCreateClass,
          text: "Create",
        }}
        // search={{enabled: true, placeholder: 'Search by key...'}}
        filters={{
          filtersInfo: {
            [FilterFields.twinIdList]: FILTERS[FilterFields.twinIdList],
            [FilterFields.twinNameLikeList]:
              FILTERS[FilterFields.twinNameLikeList],
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
            "id",
            "createdAt",
            "authorUserId",
            "name",
            "assignerUserId",
            "twinClassId",
          ],
        }}
      />

      <div className="w-0 flex-0 lg:w-16" />

      {/*<TwinClassDialog open={classDialogOpen}*/}
      {/*                 onOpenChange={(newOpen) => {*/}
      {/*                     setClassDialogOpen(newOpen);*/}
      {/*                 }}*/}
      {/*                 onSuccess={() => tableRef.current?.refresh()}/>*/}
    </main>
  );
}
