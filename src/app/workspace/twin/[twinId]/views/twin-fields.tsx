import { TwinField, useFetchFields } from "@/entities/twinField";
import { PagedResponse } from "@/shared/api";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";
import { ColumnDef } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { toast } from "sonner";
import { TwinContext } from "../twin-context";

export function TwinFields() {
  const { twinId } = useContext(TwinContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { fetchFieldsByTwinId } = useFetchFields();

  const columns: ColumnDef<TwinField>[] = [
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

  async function fetchFields(): Promise<PagedResponse<TwinField>> {
    try {
      const response = await fetchFieldsByTwinId({ twinId });
      return response;
    } catch (e) {
      toast.error("Failed to fetch twin fields");
      return { data: [], pagination: {} };
    }
  }

  return (
    <Experimental_CrudDataTable
      ref={tableRef}
      title="Fields"
      columns={columns}
      getRowId={(row) => row.key!}
      fetcher={fetchFields}
      disablePagination={true}
    />
  );
}
