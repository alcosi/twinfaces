"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef } from "@tanstack/table-core";
import { toast } from "sonner";
import { ApiContext } from "@/shared/api";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { DataListOption } from "@/entities/datalist";
import { DatalistContext } from "@/app/datalists/[datalistId]/datalist-context";

export const DatalistOptions = () => {
  const api = useContext(ApiContext);
  const { datalist, datalistId } = useContext(DatalistContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { setBreadcrumbs } = useBreadcrumbs();
  const [columns, setColumns] = useState<ColumnDef<DataListOption>[]>([]);

  useEffect(() => {
    fetchDataList();
  }, [datalistId]);

  useEffect(() => {
    setBreadcrumbs([
      { label: "Datalists", href: "/datalists" },
      { label: datalist?.name!, href: `/datalists/${datalistId}` },
    ]);
  }, [datalist?.name, datalistId]);

  async function fetchDataList(): Promise<{
    data: DataListOption[];
    pageCount: number;
  }> {
    if (!datalist?.id) {
      toast.error("Datalist ID is missing");
      return { data: [], pageCount: 0 };
    }

    try {
      const response = await api.datalist.getById({
        id: datalistId,
        query: {
          showDataListMode: "DETAILED",
          showDataListOptionMode: "DETAILED",
        },
      });

      const options = response.data?.dataList?.options || {};
      const datalist = Object.values(options);

      const attributeKeys = new Set<string>();
      datalist.forEach((item: DataListOption) => {
        if (item?.attributes) {
          Object.keys(item?.attributes).forEach((key) =>
            attributeKeys.add(key)
          );
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
        {
          id: "icon",
          accessorKey: "icon",
          header: "Icon",
        },
      ]);

      return { data: datalist, pageCount: 0 };
    } catch (e) {
      console.error("Failed to fetch datalists", e);
      toast.error("Failed to fetch datalists");
      return { data: [], pageCount: 0 };
    }
  }

  if (!datalist) {
    console.error("DatalistGeneral: no datalist");
    return;
  }

  return (
    <>
      <Experimental_CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id!}
        fetcher={fetchDataList}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
      />
    </>
  );
};
