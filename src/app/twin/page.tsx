"use client";

import { toast } from "sonner";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { useCallback, useContext, useRef } from "react";
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
    accessorKey: "twinClassId",
    header: "Twin Class",
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
  {
    accessorKey: "statusId",
    header: "Status",
    cell: (data) => <ShortGuidWithCopy value={data.row.original.statusId} />,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "authorUserId",
    header: "Author",
    cell: (data) => (
      <ShortGuidWithCopy value={data.row.original.authorUserId} />
    ),
  },
  {
    accessorKey: "assignerUserId",
    header: "Assigner",
    cell: (data) => (
      <ShortGuidWithCopy value={data.row.original.assignerUserId} />
    ),
  },
  {
    accessorKey: "headTwinId",
    header: "Head",
    cell: ({ row: { original } }) =>
      original.headTwinId ? (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={{ id: original.headTwinId }}
            withTooltip
          />
        </div>
      ) : null,
  },
  {
    accessorKey: "tags",
    header: "Tags",
  },
  {
    accessorKey: "markers",
    header: "Markers",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
  },
];

export default function Twin() {
  // const [classDialogOpen, setClassDialogOpen] = useState(false);

  const api = useContext(ApiContext);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);

  const findTwinById = useCallback(
    async (id: string) => {
      try {
        const { data } = await api.twin.getById({
          id,
          query: {
            showTwinMode: "DETAILED",
            showTwinClassMode: "DETAILED",
            showTwinMarker2DataListOptionMode: "DETAILED",
            showTwinTag2DataListOptionMode: "DETAILED",
            showTwin2TwinClassMode: "DETAILED",
          },
        });

        return data?.twin;
      } catch (error) {
        console.error(`Failed to find twin by ID: ${id}`, error);
        throw new Error(`Failed to find twin with ID ${id}`);
      }
    },
    [api]
  );

  async function fetchTwin({
    search,
    pagination,
    filters,
  }: {
    search?: string;
    pagination?: PaginationState;
    filters?: FiltersState;
  }): Promise<FetchDataResponse> {
    const _pagination = pagination || { pageIndex: 0, pageSize: 10 };
    const _filters = buildFilters(filters ?? { filters: {} });

    try {
      const { data, error } = await api.twin.search({
        pagination: _pagination,
        search: search,
        filters: _filters,
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
          (data.pagination?.total ?? 0) / _pagination.pageSize
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

  // function openCreateClass() {
  //   setClassDialogOpen(true);
  // }

  return (
    <main className={"p-8 lg:flex lg:justify-center flex-col mx-auto"}>
      <div className="w-0 flex-0 lg:w-16" />

      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={(pagination, filters) => fetchTwin({ pagination, filters })}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) => router.push(`/twin/${row.id}`)}
        // createButton={{
        //   enabled: true,
        //   onClick: openCreateClass,
        //   text: "Create Class",
        // }}
        // search={{enabled: true, placeholder: 'Search by key...'}}
        filters={{
          filtersInfo: {
            [FilterFields.twinIdList]: FILTERS.twinIdList,

            [FilterFields.twinClassIdList]: {
              ...FILTERS.twinClassIdList,
              getById: findTwinById,
              getItems: async (search) => (await fetchTwin({ search })).data,
              getItemKey: (item) => item?.id,
              getItemLabel: ({ twinClass = "", name }) =>
                `${twinClass.name}${name ? ` (${name})` : ""}`,
            },

            [FilterFields.statusIdList]: {
              ...FILTERS.statusIdList,
              getById: findTwinById,
              getItems: async (search) => (await fetchTwin({ search })).data,
              getItemKey: (item) => item?.id,
              getItemLabel: ({ twinClass = "", name }) =>
                `${twinClass.name}${name ? ` (${name})` : ""}`,
            },

            [FilterFields.twinNameLikeList]:
              FILTERS[FilterFields.twinNameLikeList],

            [FilterFields.createdByUserIdList]:
              FILTERS[FilterFields.createdByUserIdList],

            [FilterFields.assignerUserIdList]:
              FILTERS[FilterFields.assignerUserIdList],

            [FilterFields.headTwinIdList]: {
              ...FILTERS.headTwinIdList,
              getById: findTwinById,
              getItems: async (search) => (await fetchTwin({ search })).data,
              getItemKey: (item) => item?.id,
              getItemLabel: ({ twinClass = "", name }) =>
                `${twinClass.name}${name ? ` (${name})` : ""}`,
            },

            [FilterFields.tagDataListOptionIdList]:
              FILTERS[FilterFields.tagDataListOptionIdList],

            [FilterFields.markerDataListOptionIdList]:
              FILTERS[FilterFields.markerDataListOptionIdList],
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
            "twinClassId",
            "statusId",
            "name",
            "description",
            "authorUserId",
            "assignerUserId",
            "headTwinId",
            "createdAt",
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
