import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import CreateEditTwinFieldDialog from "@/app/twinclass/[twinClassId]/twin-field-dialog";
import {
  CrudDataTable,
  FiltersState,
} from "@/components/base/data-table/crud-data-table";
import { DataTableHandle } from "@/components/base/data-table/data-table";
import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { ApiContext } from "@/shared/api";
import { TwinClassField } from "@/entities/twinClass";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";
import { toast } from "sonner";

export function TwinClassFields() {
  const api = useContext(ApiContext);
  const { twinClass } = useContext(TwinClassContext);
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();

  const [createEditFieldDialogOpen, setCreateEditFieldDialogOpen] =
    useState<boolean>(false);
  const [editedField, setEditedField] = useState<TwinClassField | null>(null);

  const columns: ColumnDef<TwinClassField>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()} />,
    },
    {
      accessorKey: "key",
      header: "Key",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    // {
    //     accessorKey: "description",
    //     header: "Description",
    // },
    {
      accessorKey: "required",
      header: "Required",
      cell: (data) => <>{data.getValue() && <Check />}</>,
    },
    // {
    //     header: "Actions",
    //     cell: (data) => {
    //         return <Button variant="ghost" size="iconS6" onClick={() => editField(data.row.original)}><Edit2Icon/></Button>
    //     }
    // }
  ];

  async function fetchFields(_: PaginationState, filters: FiltersState) {
    if (!twinClass?.id) {
      toast.error("Twin class ID is missing");
      return { data: [], pageCount: 0 };
    }

    try {
      const response = await api.twinClass.getFields({ id: twinClass.id });
      const data = response.data;
      if (!data || data.status != 0) {
        console.error("failed to fetch twin class fields", data);
        let message = "Failed to load twin class fields";
        if (data?.msg) message += `: ${data.msg}`;
        toast.error(message);
        return { data: [], pageCount: 0 };
      }
      // setFields(data.twinClassFieldList ?? []);
      return { data: data.twinClassFieldList ?? [], pageCount: 0 };
    } catch (e) {
      console.error("exception while fetching twin class fields", e);
      toast.error("Failed to fetch twin class fields");
      return { data: [], pageCount: 0 };
    }
  }

  function createField() {
    setEditedField(null);
    setCreateEditFieldDialogOpen(true);
  }

  function editField(field: TwinClassField) {
    setEditedField(field);
    setCreateEditFieldDialogOpen(true);
  }

  if (!twinClass) {
    console.error("TwinClassFields: no twin class");
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
        createButton={{
          enabled: true,
          onClick: createField,
        }}
        disablePagination={true}
        pageSizes={[10, 20, 50]}
        onRowClick={(row) =>
          router.push(`/twinclass/${twinClass!.id!}/twinField/${row.id}`)
        }
      />

      <CreateEditTwinFieldDialog
        open={createEditFieldDialogOpen}
        twinClassId={twinClass.id!}
        field={editedField}
        onOpenChange={setCreateEditFieldDialogOpen}
        onSuccess={tableRef.current?.refresh}
      />
    </>
  );
}
