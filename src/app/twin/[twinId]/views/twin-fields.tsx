import { ApiContext, PagedResponse } from "@/shared/api";
import {
  CrudDataTable,
  FiltersState,
} from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { toast } from "sonner";
import { TwinContext } from "../twin-context";

interface DataField {
  [key: string]: string;
}

export function TwinFields() {
  const api = useContext(ApiContext);
  const { twin } = useContext(TwinContext);
  const tableRef = useRef<DataTableHandle>(null);

  const columns: ColumnDef<DataField>[] = [
    {
      id: "key",
      accessorKey: "key",
      header: "Key",
    },
    {
      id: "value",
      accessorKey: "value",
      header: "Value",
    },
  ];

  async function fetchFields(
    _: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<{ key: string; value: string }>> {
    if (!twin?.id) {
      toast.error("Twin ID is missing");
      return { data: [], pagination: {} };
    }

    try {
      const response = await api.twin.getFieldById({ fieldId: twin.id });
      const data = response.data;

      if (!data || data.status != 0) {
        console.error("failed to fetch twin fields", data);
        let message = "Failed to load twin fields";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pagination: {} };
      }

      const fields = data?.twin?.fields || [];
      const entriesFields = Object.entries(fields).map(([key, value]) => ({
        key,
        value: value,
      }));

      return { data: entriesFields, pagination: {} };
    } catch (e) {
      console.error("exception while fetching twin fields", e);
      toast.error("Failed to fetch twin fields");
      return { data: [], pagination: {} };
    }
  }

  if (!twin) {
    console.error("TwinFields: no twin");
    return;
  }

  return (
    <CrudDataTable
      ref={tableRef}
      title="Fields"
      columns={columns}
      getRowId={(row) => row.key!}
      fetcher={fetchFields}
      // createButton={{
      //     enabled: true,
      //     onClick: createField,
      // }}
      disablePagination={true}
      pageSizes={[10, 20, 50]}
      // onRowClick={(row) => router.push(`/twin/${twin!.id!}/twinField/${row.id}`)}
    />
  );
}
