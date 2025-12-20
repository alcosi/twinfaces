import { ColumnDef } from "@tanstack/table-core";
import { useContext, useRef } from "react";

import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFieldUI } from "@/entities/twinField";
import { TwinFieldAttributeResourceLink } from "@/features/attributes/resource-link";
import { InPlaceEditContextProvider } from "@/features/inPlaceEdit";
import { TwinContext } from "@/features/twin";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinFieldEditor } from "@/features/twin/ui";
import { PagedResponse } from "@/shared/api";
import { isPopulatedArray } from "@/shared/libs";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import { resolveTwinFieldSchema } from "@/widgets/form-fields";

export function TwinFields() {
  const { twinId, twin } = useContext(TwinContext);
  const tableRef = useRef<DataTableHandle>(null);

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
              field={original}
              schema={resolveTwinFieldSchema(original)}
              onSuccess={tableRef.current?.refresh}
              editable
            />
          </div>
        );
      },
    },
    {
      id: "attributes",
      accessorKey: "attributes",
      header: "Attributes",
      cell: ({ row: { original } }) => {
        if (!isPopulatedArray(original.attributes)) {
          return "N/A";
        }

        return (
          <div className="inline-flex max-w-90 flex-wrap gap-1">
            {original.attributes.map((attribute) => (
              <TwinFieldAttributeResourceLink
                key={attribute.id}
                data={attribute}
                withTooltip
              />
            ))}
          </div>
        );
      },
    },
  ];

  async function fetchFields(): Promise<PagedResponse<TwinFieldUI>> {
    if (!twin || !twin.fields) {
      return { data: [], pagination: {} };
    }
    const fields = Object.values(twin.fields);
    return {
      data: fields,
      pagination: {},
    };
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
