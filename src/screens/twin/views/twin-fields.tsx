import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useContext, useRef } from "react";

import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import {
  TwinFieldUI,
  getTwinFieldDisplayName,
  isTwinFieldEditable,
} from "@/entities/twinField";
import { TwinFieldAttributeResourceLink } from "@/features/attributes/resource-link";
import { InPlaceEditContextProvider } from "@/features/inPlaceEdit";
import { TwinContext } from "@/features/twin";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinFieldEditor } from "@/features/twin/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { isPopulatedArray } from "@/shared/libs";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableFieldOption,
  SortableHeader,
} from "@/widgets/crud-data-table";
import { resolveTwinFieldSchema } from "@/widgets/form-fields";

/** The only sortable column — the rest hold free-form values. */
const NAME_SORT_FIELD = "name";

// Mirrors the column's sortable header so the card view, which has no clickable
// headers, drives the same sort state.
const sortableFields: SortableFieldOption[] = [
  { field: NAME_SORT_FIELD, label: "Fields" },
];

export function TwinFields() {
  const { twinId, twin, refresh } = useContext(TwinContext);
  const tableRef = useRef<DataTableHandle>(null);

  const columns: ColumnDef<TwinFieldUI>[] = [
    {
      id: "key",
      accessorKey: "key",
      header: () => (
        <SortableHeader title="Fields" sortField={NAME_SORT_FIELD} />
      ),
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
              onSuccess={refresh}
              editable={isTwinFieldEditable(original)}
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

  // The rows come from the already-loaded twin, so there is no request to
  // delegate the sort to — it is applied in memory over the whole dataset.
  async function fetchFields(
    _pagination: PaginationState,
    _filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<TwinFieldUI>> {
    if (!twin || !twin.fields) {
      return { data: [], pagination: {} };
    }

    const fields = Object.values(twin.fields);

    return {
      data: sortByDisplayName(fields, sort),
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
        sortableFields={sortableFields}
        // A row is a field of this twin, not a resource of the twin route, so
        // there is nothing to navigate to: only the field's resource link and
        // the value editor handle clicks.
        disableRowClick
        disablePagination={true}
      />
    </InPlaceEditContextProvider>
  );
}

function sortByDisplayName(
  fields: TwinFieldUI[],
  sort?: SortV1
): TwinFieldUI[] {
  if (sort?.field !== NAME_SORT_FIELD || !sort.direction) {
    return fields;
  }

  const order = sort.direction === "DESC" ? -1 : 1;

  return [...fields].sort(
    (left, right) =>
      order *
      getTwinFieldDisplayName(left).localeCompare(
        getTwinFieldDisplayName(right)
      )
  );
}
