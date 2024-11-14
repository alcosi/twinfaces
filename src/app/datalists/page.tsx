"use client";

import { useContext, useEffect, useRef } from "react";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { FiltersState } from "@/components/base/data-table/crud-data-table";
import { toast } from "sonner";

import { DataList } from "@/entities/datalist";
import { ApiContext } from "@/shared/api";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { buildFilters, FilterFields, FILTERS } from "@/entities/datalist/libs";
import { useRouter } from "next/navigation";
import { useBreadcrumbs } from "@/features/breadcrumb";

const colDefs: Record<
  keyof Pick<DataList, "id" | "name" | "updatedAt">,
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
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Datalists", href: "/datalists" }]);
  }, []);

  async function fetchDataLists(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<{ data: DataList[]; pageCount: number }> {
    const _filters = buildFilters(filters ?? { filters: {} });

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
    <>
      <Experimental_CrudDataTable
        ref={tableRef}
        columns={[colDefs.id!, colDefs.name!, colDefs.updatedAt!]}
        getRowId={(row) => row.id!}
        fetcher={fetchDataLists}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) => router.push(`/datalists/${row.id}`)}
        filters={{
          filtersInfo: {
            [FilterFields.dataListIdList]: FILTERS.dataListIdList,
          },
          onChange: () => {
            return Promise.resolve();
          },
        }}
      />
    </>
  );
};

export default Page;
