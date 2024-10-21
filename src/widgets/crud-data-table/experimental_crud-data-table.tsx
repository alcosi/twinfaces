"use client";

import { AutoFormValueInfo } from "@/components/auto-field";
import { Button } from "@/components/base/button";
import {
  DataTable,
  DataTableHandle,
  DataTableProps,
} from "@/components/base/data-table/data-table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base/dialog";
import { Form } from "@/components/base/form";
import { cn, fixedForwardRef } from "@/lib/utils";
import { PaginationState } from "@tanstack/table-core";
import {
  ForwardedRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { CrudDataTableHeader } from "./header";
import { Identifiable } from "@/shared/types";

interface FiltersState {
  search?: string;
  filters: { [key: string]: any };
}

interface CrudDataTableSearchProps {
  enabled?: boolean;
  placeholder?: string;
}

interface CrudDataTableFiltersProps {
  filtersInfo: { [key: string]: AutoFormValueInfo };
  onChange: (values: { [key: string]: any }) => Promise<any>;
}

interface CrudDataTableCustomizableColumnsProps {
  enabled?: boolean;
  defaultVisibleKeys?: string[];
}

interface CrudDataTableProps<TData extends Identifiable, TValue>
  extends Omit<DataTableProps<TData, TValue>, "fetcher"> {
  fetcher: (
    pagination: PaginationState,
    filters: FiltersState
  ) => Promise<{ data: TData[]; pageCount: number }>;
  title?: string;
  search?: CrudDataTableSearchProps;
  filters?: CrudDataTableFiltersProps;
  customizableColumns?: CrudDataTableCustomizableColumnsProps;
  hideRefresh?: boolean;
  className?: string;
  // TODO: refactor typings
  dialogForm?: UseFormReturn<any>;
  onCreateSubmit?: (values: any) => Promise<void>;
  onUpdateSubmit?: (id: string, values: any) => Promise<void>;
  // TODO: imporove later using AutoFields
  renderFormFields?: () => ReactNode;
}

type DialogState = {
  open: boolean;
  selectedRowId: string | null;
};

export const Experimental_CrudDataTable = fixedForwardRef(
  CrudDataTableInternal
);

function CrudDataTableInternal<TData extends Identifiable, TValue>(
  {
    title,
    search,
    filters,
    customizableColumns,
    hideRefresh,
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
  const [tableSearch, setTableSearch] = useState<string>("");
  const [tableFilters, setTableFilters] = useState<{ [key: string]: any }>({});
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    customizableColumns?.defaultVisibleKeys ?? []
  );
  const [sortColumnKeys, setSortColumnKeys] = useState<string[]>(
    props.columns?.map((col) => getColumnKey(col)) ?? []
  );
  const tableRef = useRef<DataTableHandle>(null);
  const defaultValues = useRef(dialogForm?.formState.defaultValues).current;
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    selectedRowId: null,
  });

  useImperativeHandle(ref, () => tableRef.current!, [tableRef]);

  function fetchWrapper(pagination: PaginationState) {
    return fetcher(pagination, { search: tableSearch, filters: tableFilters });
  }

  async function refresh() {
    tableRef.current?.refresh();
  }

  async function onFiltersChange(values: { [key: string]: any }) {
    setTableFilters(values);
    filters?.onChange(values);
  }
  useEffect(() => {
    tableRef.current?.resetPage();
    refresh();
  }, [tableFilters]);

  useEffect(() => {
    console.log("visibleColumns", visibleColumnKeys);
  }, [visibleColumnKeys]);

  const visibleColumns = useMemo(() => {
    return customizableColumns?.enabled
      ? props.columns
          .filter((column) => {
            return visibleColumnKeys.includes(getColumnKey(column));
          })
          .sort((a, b) => {
            return (
              sortColumnKeys.indexOf(getColumnKey(a)) -
              sortColumnKeys.indexOf(getColumnKey(b))
            );
          })
      : props.columns;
  }, [customizableColumns, visibleColumnKeys, sortColumnKeys]);

  function handleOpenChange(open: boolean) {
    if (!open && dialogForm?.formState.isSubmitting) {
      return;
    }

    setDialogState((prev) => ({
      ...prev,
      open,
      isCreating: false,
      isUpdating: false,
    }));
    dialogForm?.reset();
  }

  const onSubmit = async (formValues: unknown) => {
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
  };

  return (
    <div className={cn("flex-1", className)}>
      <CrudDataTableHeader
        title={title}
        search={search}
        onSearch={(e) => {
          e.preventDefault();
          refresh();
        }}
        tableSearch={tableSearch}
        setTableSearch={setTableSearch}
        hideRefresh={hideRefresh}
        filters={filters}
        onFiltersChange={onFiltersChange}
        refresh={refresh}
        customizableColumns={customizableColumns}
        columns={props.columns}
        visibleColumnKeys={visibleColumnKeys}
        setVisibleColumnKeys={setVisibleColumnKeys}
        sortColumnKeys={sortColumnKeys}
        setSortColumnKeys={setSortColumnKeys}
        onCreateClick={() => {
          dialogForm?.reset(defaultValues);
          setDialogState({
            open: true,
            selectedRowId: null,
          });
        }}
      />

      <DataTable
        ref={tableRef}
        {...props}
        columns={visibleColumns}
        fetcher={fetchWrapper}
        onRowClick={(row) => {
          dialogForm?.reset(row);
          setDialogState({
            open: true,
            selectedRowId: row.id ?? "",
          });
        }}
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
                onSubmit={dialogForm.handleSubmit(onSubmit)}
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

function getColumnKey(column: any) {
  return column.accessorKey ? (column.accessorKey as string) : column.id!;
}
