import { TwinClassField } from "@/entities/twinClass";
import { useContext, useRef, useState } from "react";
import { ApiContext } from "@/shared/api";
import { toast } from "sonner";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { TwinContext } from "@/app/twin/[twinId]/twin-context";

interface DataField {
  [key: string]: string;
}

export function TwinFields() {
  const api = useContext(ApiContext);
  const { twin } = useContext(TwinContext);
  const tableRef = useRef<DataTableHandle>(null);

  const [createEditFieldDialogOpen, setCreateEditFieldDialogOpen] =
    useState<boolean>(false);
  const [editedField, setEditedField] = useState<TwinClassField | null>(null);

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

  async function fetchFields(_: PaginationState, filters: FiltersState) {
    if (!twin?.id) {
      toast.error("Twin ID is missing");
      return { data: [], pageCount: 0 };
    }

    try {
      const response = await api.twin.getFieldById({ fieldId: twin.id });
      const data = response.data;

      if (!data || data.status != 0) {
        console.error("failed to fetch twin fields", data);
        let message = "Failed to load twin fields";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pageCount: 0 };
      }

      const fields = data?.twin?.fields || [];
      const entriesFields = Object.entries(fields).map(([key, value]) => ({
        key,
        value: value,
      }));

      return { data: entriesFields, pageCount: 0 };
    } catch (e) {
      console.error("exception while fetching twin fields", e);
      toast.error("Failed to fetch twin fields");
      return { data: [], pageCount: 0 };
    }
  }

  // function createField() {
  //     setEditedField(null);
  //     setCreateEditFieldDialogOpen(true);
  // }

  // function editField(field: TwinClassField) {
  //     setEditedField(field);
  //     setCreateEditFieldDialogOpen(true);
  // }

  if (!twin) {
    console.error("TwinFields: no twin");
    return;
  }

  return (
    <>
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

      {/*<CreateEditTwinFieldDialog open={createEditFieldDialogOpen} twinClassId={twin.id!} field={editedField}*/}
      {/*                           onOpenChange={setCreateEditFieldDialogOpen}*/}
      {/*                           onSuccess={tableRef.current?.refresh}/>*/}
    </>
  );
}
