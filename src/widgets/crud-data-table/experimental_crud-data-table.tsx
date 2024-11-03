"use client";

import { Button } from "@/components/base/button";
import {
  DataTable,
  DataTableHandle,
  DataTableProps,
  DataTableRow,
} from "@/components/base/data-table/data-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import { Form } from "@/components/base/form";
import { cn, fixedForwardRef, isFullArray } from "@/shared/libs";
import { PaginationState } from "@tanstack/table-core";
import {
  ForwardedRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  CrudDataTableHeader,
  CrudDataTableHeaderProps,
  FilterState,
} from "./header";
import { getColumnKey, groupDataByKey } from "./helpers";

type CrudDataTableProps<
  TData extends DataTableRow<TData>,
  TValue,
> = CrudDataTableHeaderProps &
  Omit<DataTableProps<TData, TValue>, "fetcher"> & {
    fetcher: (
      pagination: PaginationState,
      filters: { search?: string; filters: { [key: string]: any } }
    ) => Promise<{ data: TData[]; pageCount: number }>;
    className?: string;
    defaultVisibleColumns?: DataTableProps<TData, TValue>["columns"];
    orderedColumns?: DataTableProps<TData, TValue>["columns"];
    groupableColumns?: DataTableProps<TData, TValue>["columns"];
    dialogForm?: UseFormReturn<any>;
    onCreateSubmit?: (values: any) => Promise<void>;
    onUpdateSubmit?: (id: string, values: any) => Promise<void>;
    renderFormFields?: () => ReactNode;
  };

type DialogState = {
  open: boolean;
  selectedRowId: string | null;
};

export const Experimental_CrudDataTable = fixedForwardRef(
  CrudDataTableInternal
);

function CrudDataTableInternal<TData extends DataTableRow<TData>, TValue>(
  {
    className,
    fetcher,

    dialogForm,
    onCreateSubmit,
    onUpdateSubmit,
    renderFormFields,
    ...props
  }: CrudDataTableProps<TData, TValue>,
  ref: ForwardedRef<DataTableHandle>
) {
  const tableRef = useRef<DataTableHandle>(null);
  const [viewSettings, updateViewSettings] = useReducer(
    (state: FilterState, updates: Partial<FilterState>) => ({
      ...state,
      ...updates,
    }),
    {
      query: "",
      filters: {},
      visibleKeys: props.defaultVisibleColumns?.map(getColumnKey) ?? [],
      orderKeys: props.orderedColumns?.map(getColumnKey) ?? [],
      groupByKey: undefined,
    }
  );
  const defaultValues = useRef(dialogForm?.formState.defaultValues).current;
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    selectedRowId: null,
  });

  useImperativeHandle(ref, () => tableRef.current!, [tableRef]);

  useEffect(() => {
    tableRef.current?.refresh();
  }, [viewSettings]);

  const fetchWrapper = async (pagination: PaginationState) => {
    try {
      const response = await fetcher(pagination, {
        search: viewSettings.query,
        filters: viewSettings.filters,
      });

      if (viewSettings.groupByKey) {
        response.data = groupDataByKey(response.data, viewSettings.groupByKey);
      }

      return response;
    } catch (error) {
      console.error("Error in fetchWrapper:", error);
      throw error;
    }
  };

  const visibleColumns = useMemo(() => {
    if (isFullArray(props.defaultVisibleColumns)) {
      return props.columns
        .filter((column) =>
          viewSettings.visibleKeys.includes(getColumnKey(column))
        )
        .sort(
          (a, b) =>
            viewSettings.orderKeys.indexOf(getColumnKey(a)) -
            viewSettings.orderKeys.indexOf(getColumnKey(b))
        );
    }

    return props.columns;
  }, [
    viewSettings.visibleKeys,
    viewSettings.orderKeys,
    props.columns,
    props.defaultVisibleColumns,
  ]);

  function handleOpenChange(open: boolean) {
    if (!open && dialogForm?.formState.isSubmitting) return;

    setDialogState({ open, selectedRowId: null });
    dialogForm?.reset();
  }

  async function onDialogFormSubmit(formValues: unknown) {
    try {
      if (dialogState.selectedRowId) {
        await onUpdateSubmit?.(dialogState.selectedRowId, formValues);
      } else {
        await onCreateSubmit?.(formValues);
      }
      setDialogState({
        open: false,
        selectedRowId: null,
      });
      tableRef.current?.refresh();
    } catch (error) {
      console.error("Action failed:", error);
      toast.error("Action failed");
    }
  }

  const handleOnCreateClick = onCreateSubmit
    ? () => {
        dialogForm?.reset(defaultValues);
        setDialogState({
          open: true,
          selectedRowId: null,
        });
      }
    : undefined;

  const handleOnRowClick = onUpdateSubmit
    ? (row: TData) => {
        dialogForm?.reset(row);
        setDialogState({
          open: true,
          selectedRowId: row.id ?? "",
        });
      }
    : undefined;

  return (
    <div className={cn("flex-1", className)}>
      <CrudDataTableHeader
        ref={tableRef}
        title={props.title}
        search={props.search}
        hideRefresh={props.hideRefresh}
        columns={props.columns}
        defaultVisibleColumns={props.defaultVisibleColumns}
        orderedColumns={props.orderedColumns}
        groupableColumns={props.groupableColumns}
        filters={props.filters}
        onCreateClick={handleOnCreateClick}
        onViewSettingsChange={updateViewSettings}
      />

      <DataTable
        ref={tableRef}
        {...props}
        columns={visibleColumns}
        fetcher={fetchWrapper}
        onRowClick={handleOnRowClick}
      />

      {dialogForm && (
        <Dialog open={dialogState.open} onOpenChange={handleOpenChange}>
          <DialogContent className="sm:max-w-md overflow-y-scroll max-h-[100%] sm:max-h-[80%]">
            <DialogHeader>
              <DialogTitle>
                {dialogState.selectedRowId ? "Edit" : "Create"}
              </DialogTitle>
            </DialogHeader>

            <Form {...dialogForm}>
              <form
                onSubmit={dialogForm.handleSubmit(onDialogFormSubmit)}
                className="space-y-8"
              >
                <div className="space-y-8 p-1">
                  {renderFormFields && renderFormFields()}
                </div>

                <div className="sticky bottom-0 bg-background">
                  <DialogFooter className="sm:justify-end py-4">
                    <Button
                      type="submit"
                      loading={dialogForm.formState.isSubmitting}
                      disabled={!dialogForm.formState.isDirty}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
