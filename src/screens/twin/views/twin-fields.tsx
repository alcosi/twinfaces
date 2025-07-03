import { ColumnDef } from "@tanstack/table-core";
import { memo, useCallback, useContext, useMemo, useRef } from "react";
import { toast } from "sonner";

import { AutoFormValueType } from "@/components/auto-field";

import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import {
  TwinFieldUI,
  useFetchFields,
  useUpsertField,
} from "@/entities/twinField";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
} from "@/features/inPlaceEdit";
import { TwinContext } from "@/features/twin";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { PagedResponse } from "@/shared/api";
import { isObject, isPopulatedString, isTruthy } from "@/shared/libs";
import { CrudDataTable, DataTableHandle } from "@/widgets/crud-data-table";
import {
  renderTwinFieldPreview,
  resolveTwinFieldSchema,
} from "@/widgets/form-fields";

const TwinFieldsComponent = () => {
  const { twinId } = useContext(TwinContext);
  const tableRef = useRef<DataTableHandle>(null);
  const { fetchFieldsByTwinId } = useFetchFields();
  const { upsertTwinField } = useUpsertField();

  const columns: ColumnDef<TwinFieldUI>[] = useMemo(
    () => [
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
              <InPlaceEdit
                id={original.key}
                value={
                  isObject(original.value) && isTruthy(original.value.id)
                    ? original.value.id
                    : original.value
                }
                valueInfo={{
                  type: AutoFormValueType.twinField,
                  descriptor: original.descriptor,
                  twinId,
                }}
                schema={resolveTwinFieldSchema(original)}
                renderPreview={(_) =>
                  renderTwinFieldPreview({
                    twinField: original,
                    allowNavigation: true,
                  })
                }
                onSubmit={(fieldValue) =>
                  upsertTwinField({
                    twinId,
                    fieldKey: original.key,
                    fieldValue: isPopulatedString(fieldValue)
                      ? fieldValue
                      : fieldValue.id!,
                  }).then(tableRef.current?.refresh)
                }
                className="hover:bg-transparent"
              />
            </div>
          );
        },
      },
    ],
    [twinId, upsertTwinField]
  );

  const fetchFields = useCallback(async (): Promise<
    PagedResponse<TwinFieldUI>
  > => {
    console.log("TwinFieldsComponent fetchFields called!!!!!!!!!!!!!!!!!");
    try {
      return await fetchFieldsByTwinId({ twinId });
    } catch (e) {
      toast.error("Failed to fetch twin fields");
      return { data: [], pagination: {} };
    }
  }, [fetchFieldsByTwinId, twinId]);

  const pageSizes = useMemo(() => [10, 25, 50], []);

  return (
    <InPlaceEditContextProvider>
      <CrudDataTable
        ref={tableRef}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizes={pageSizes}
        fetcher={fetchFields}
        disablePagination={true}
      />
    </InPlaceEditContextProvider>
  );
};

export const TwinFields = memo(TwinFieldsComponent);
