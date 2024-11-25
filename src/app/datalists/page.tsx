"use client";

import { useContext, useEffect, useRef } from "react";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { FiltersState } from "@/shared/ui/data-table/crud-data-table";
import { toast } from "sonner";

import { DataList } from "@/entities/datalist";
import { ApiContext } from "@/shared/api";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { ShortGuidWithCopy } from "@/shared/ui/short-guid";
import { useRouter } from "next/navigation";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useDatalistFilters } from "@/entities/datalist/libs/hooks/useFilters";

const colDefs: Record<
  keyof Pick<DataList, "id" | "name" | "updatedAt" | "description">,
  ColumnDef<DataList>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
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
    setBreadcrumbs([{ label: "Datalists", href: "/datalists" }]);
  }, []);

  async function fetchDataLists(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<{ data: DataList[]; pageCount: number }> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await api.datalist.searchDatalist({
        pagination,
        filters: _filters,
      });

      const data = response.data?.dataListList ?? [];

      return { data: data, pageCount: 0 };
    } catch (e) {
      console.error("Failed to fetch datalists", e);
      toast.error("Failed to fetch datalists");
      return { data: [], pageCount: 0 };
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
      onRowClick={(row) => router.push(`/datalists/${row.id}`)}
      filters={{
        filtersInfo: buildFilterFields(),
        onChange: () => {
          return Promise.resolve();
        },
      }}
    />
  );
};

export default Page;
