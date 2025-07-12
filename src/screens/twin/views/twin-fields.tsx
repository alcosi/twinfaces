import { ColumnDef } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { toast } from "sonner";

import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFieldUI, useFetchFields } from "@/entities/twinField";
import { InPlaceEditContextProvider } from "@/features/inPlaceEdit";
import { TwinContext } from "@/features/twin";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinFieldEditor } from "@/features/twin/ui";
import { PagedResponse } from "@/shared/api";
import { isObject, isTruthy } from "@/shared/libs";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import { resolveTwinFieldSchema } from "@/widgets/form-fields";

export function TwinFields() {
  const { twinId } = useContext(TwinContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { fetchFieldsByTwinId } = useFetchFields();
  const columns: ColumnDef<TwinFieldUI>[] = [
    {
      id: "key",
      accessorKey: "key",
      header: "Fields",
      cell: ({ row: { original } }) =>
        original && (
          <div className="inline-flex max-w-48">
            <TwinClassFieldResourceLink
              data={original as TwinClassField_DETAILED}
              withTooltip
            />
          </div>
        ),
    },
    {
      id: "value",
      accessorKey: "value",
      header: "Value",
      cell: ({ row: { original } }) => {
        return (
          <div
            className="inline-block w-full min-w-[300px]"
            onClick={(e) => e.stopPropagation()}
          >
            <TwinFieldEditor
              className="hover:bg-transparent"
              id={original.id}
              twinId={twinId}
              twin={original}
              field={{
                id: original.id,
                key: original.key,
                value:
                  isObject(original.value) && isTruthy(original.value.id)
                    ? String(original.value.id)
                    : String(original.value),
                name: original.name,
                descriptor: original.descriptor,
              }}
              schema={resolveTwinFieldSchema(original)}
              onSuccess={tableRef.current?.refresh}
              editable
            />
          </div>
        );
      },
    },
  ];

  async function fetchFields(): Promise<PagedResponse<TwinFieldUI>> {
    try {
      const response = await fetchFieldsByTwinId({ twinId });
      return response;
    } catch (e) {
      toast.error("Failed to fetch twin fields");
      return { data: [], pagination: {} };
    }
  }

  return (
    <InPlaceEditContextProvider>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id}
        fetcher={fetchFields}
        disablePagination={true}
      />
    </InPlaceEditContextProvider>
  );
}
