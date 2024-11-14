"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef } from "@tanstack/table-core";
import { toast } from "sonner";
import { ApiContext } from "@/shared/api";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { DataListOption } from "@/entities/datalist";

interface DatalistPageProps {
  params: {
    datalistId: string;
  };
}

const Page = ({ params: { datalistId } }: DatalistPageProps) => {
  const api = useContext(ApiContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { setBreadcrumbs } = useBreadcrumbs();
  const [columns, setColumns] = useState<ColumnDef<DataListOption>[]>([]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Datalists", href: "/datalists" },
      { label: "Datalist", href: `/datalists/${datalistId}` },
    ]);
  }, []);

  async function fetchDataList(): Promise<{
    data: DataListOption[];
    pageCount: number;
  }> {
    try {
      const response = await api.datalist.getById({
        id: datalistId,
        query: { showDataListOptionMode: "DETAILED" },
      });

      const options = response.data?.dataList?.options || {};
      const datalist = Object.values(options);

      const attributeKeys = new Set<string>();
      datalist.forEach((item: DataListOption) => {
        if (item.attributes) {
          Object.keys(item.attributes).forEach((key) => attributeKeys.add(key));
        }
      });

      const dynamicColumns: ColumnDef<DataListOption>[] = Array.from(
        attributeKeys
      ).map((key) => ({
        id: `attributes.${key}`,
        accessorKey: `attributes.${key}`,
        header: key,
      }));

      setColumns([
        {
          id: "id",
          accessorKey: "id",
          header: "ID",
          cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
        },
        {
          id: "name",
          accessorKey: "name",
          header: "Name",
        },
        ...dynamicColumns,
      ]);

      return { data: datalist, pageCount: 0 };
    } catch (e) {
      console.error("Failed to fetch datalists", e);
      toast.error("Failed to fetch datalists");
      return { data: [], pageCount: 0 };
    }
  }

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <>
      <Experimental_CrudDataTable
        title={"Options"}
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={fetchDataList}
        pageSizes={[10, 20, 50]}
      />
    </>
  );
};

export default Page;
