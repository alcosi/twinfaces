import { AutoFormValueType } from "@/components/auto-field";
import {
  TwinFieldUI,
  useFetchFields,
  useUpsertField,
} from "@/entities/twinField";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
} from "@/features/inPlaceEdit";
import { PagedResponse } from "@/shared/api";
import { isPopulatedString } from "@/shared/libs";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import {
  renderTwinFieldPreview,
  resolveTwinFieldSchema,
} from "@/widgets/form-fields";
import { ColumnDef } from "@tanstack/table-core";
import { useContext, useRef } from "react";
import { toast } from "sonner";
import { TwinContext } from "../twin-context";

export function TwinFields() {
  const { twinId } = useContext(TwinContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { fetchFieldsByTwinId } = useFetchFields();
  const { upsertTwinField } = useUpsertField();

  const columns: ColumnDef<TwinFieldUI>[] = [
    {
      id: "key",
      accessorKey: "key",
      header: "Key",
    },
    {
      id: "value",
      accessorKey: "value",
      header: "Value",
      cell: ({ row: { original } }) => {
        return (
          <InPlaceEdit
            id={original.key}
            value={original.value}
            valueInfo={{
              type: AutoFormValueType.twinField,
              descriptor: original.descriptor,
            }}
            schema={resolveTwinFieldSchema(original)}
            renderPreview={(_) => renderTwinFieldPreview(original)}
            onSubmit={(fieldValue) =>
              upsertTwinField({
                twinId,
                fieldKey: original.key,
                fieldValue: isPopulatedString(fieldValue)
                  ? fieldValue
                  : fieldValue.id!,
              }).then(tableRef.current?.refresh)
            }
          />
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
//todo there may be a problem with the operation of filters and displaying extra rows in the table recommended change getRowId={(row) => row.key!} -> getRowId={(row) => row.id!} as was done in "twin-class-statuses" and "twin-class-fields"
  return (
    <InPlaceEditContextProvider>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.key!}
        fetcher={fetchFields}
        disablePagination={true}
      />
    </InPlaceEditContextProvider>
  );
}
