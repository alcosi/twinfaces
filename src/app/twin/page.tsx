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
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import {
  TwinClassStatus,
  TwinClassStatusResourceLink,
} from "@/entities/twinClassStatus";
import { User, UserResourceLink } from "@/entities/user";
import { ApiContext } from "@/shared/api";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useRef } from "react";
import { toast } from "sonner";

type FetchDataResponse = {
  data: Twin[];
  pageCount: number;
};

const columns: ColumnDef<Twin>[] = [
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
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.twinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  {
    accessorKey: "statusId",
    header: "Status",
    cell: ({ row: { original } }) =>
      original.status && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.status as TwinClassStatus}
            twinClassId={original.twinClassId!}
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
    accessorKey: "description",
    header: "Description",
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
    accessorKey: "headTwinId",
    header: "Head",
    cell: ({ row: { original } }) =>
      original.headTwinId ? (
        <div className="max-w-48 inline-flex">
          <TwinResourceLink data={{ id: original.headTwinId }} withTooltip />
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
        data:
          data?.twinList?.map((dto) =>
            hydrateTwinFromMap(dto, data.relatedObjects)
          ) ?? [],
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

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={(pagination, filters) => fetchTwin({ pagination, filters })}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) => router.push(`/twin/${row.id}`)}
        createButton={{
          enabled: true,
          text: "Create",
        }}
        filters={{
          filtersInfo: {
            [FilterFields.twinIdList]: FILTERS.twinIdList,

            [FilterFields.twinClassIdList]: {
              ...FILTERS.twinClassIdList,
              getById: findTwinById,
              getItems: async (search) => (await fetchTwin({ search })).data,
              // TODO Find better solution than "any"
              getItemKey: (item: any) => item?.id,
              getItemLabel: ({ authorUser = "", name }: any) =>
                `${authorUser.fullName}${name ? ` (${name})` : ""}`,
            },

            [FilterFields.statusIdList]: {
              ...FILTERS.statusIdList,
              getById: findTwinById,
              getItems: async (search) => (await fetchTwin({ search })).data,
              // TODO Find better solution than "any"
              getItemKey: (item: any) => item?.id,
              getItemLabel: ({ authorUser = "", name }: any) =>
                `${authorUser.fullName}${name ? ` (${name})` : ""}`,
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
              // TODO Find better solution than "any"
              getItemKey: (item: any) => item?.id,
              getItemLabel: ({ authorUser = "", name }: any) =>
                `${authorUser.fullName}${name ? ` (${name})` : ""}`,
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
    </>
  );
}
