"use client";

import {
  DataList,
  DatalistResourceLink,
  useDatalistFilters,
} from "@/entities/datalist";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { FiltersState } from "@/shared/ui/data-table/crud-data-table";
import { toast } from "sonner";

import { PagedResponse } from "@/shared/api";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";

const colDefs: Record<
  keyof Pick<DataList, "id" | "name" | "updatedAt" | "description">,
  ColumnDef<DataList>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <DatalistResourceLink data={original} withTooltip />
      </div>
    ),
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  updatedAt: {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: ({ row: { original } }) =>
      original.updatedAt
        ? new Date(original.updatedAt).toLocaleDateString()
        : "",
  },
};

const Page = () => {
  const api = useContext(ApiContext);
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { buildFilterFields, mapFiltersToPayload } = useDatalistFilters();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Datalists", href: "/workspace/datalists" }]);
  }, []);

  async function fetchDataLists(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<DataList>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await api.datalist.searchDatalist({
        pagination,
        filters: _filters,
      });

      return {
        data: response.data?.dataListList ?? [],
        pagination: response.data?.pagination ?? {},
      };
    } catch (e) {
      console.error("Failed to fetch datalists", e);
      toast.error("Failed to fetch datalists");
      return { data: [], pagination: {} };
    }
  }

  return (
    <Experimental_CrudDataTable
      ref={tableRef}
      columns={[
        colDefs.id!,
        colDefs.name!,
        colDefs.description!,
        colDefs.updatedAt!,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchDataLists}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) => router.push(`/workspace/datalists/${row.id}`)}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
    />
  );
};

export default Page;
