"use client";

import {
  DataTable,
  DataTableHandle,
  DataTableProps,
  DataTableRow,
} from "@/shared/ui/data-table/data-table";
import { cn, fixedForwardRef, isPopulatedArray } from "@/shared/libs";
import { PaginationState } from "@tanstack/table-core";
import {
  ForwardedRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { UseFormReturn } from "react-hook-form";
import { CrudDataTableDialog, CrudDataTableDialogRef } from "./dialog";
import {
  CrudDataTableHeader,
  CrudDataTableHeaderProps,
  FilterState,
} from "./header";
import { getColumnKey, groupDataByKey } from "./helpers";
import { PagedResponse } from "@/shared/api";

type CrudDataTableProps<
  TData extends DataTableRow<TData>,
  TValue,
> = CrudDataTableHeaderProps &
  Omit<DataTableProps<TData, TValue>, "fetcher"> & {
    fetcher: (
      pagination: PaginationState,
      filters: { search?: string; filters: { [key: string]: any } }
    ) => Promise<PagedResponse<TData>>;
    className?: string;
    defaultVisibleColumns?: DataTableProps<TData, TValue>["columns"];
    orderedColumns?: DataTableProps<TData, TValue>["columns"];
    groupableColumns?: DataTableProps<TData, TValue>["columns"];
    dialogForm?: UseFormReturn<any>;
    onCreateSubmit?: (values: any) => Promise<void>;
    onUpdateSubmit?: (id: string, values: any) => Promise<void>;
    renderFormFields?: () => ReactNode;
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
    onRowClick,
    ...props
  }: CrudDataTableProps<TData, TValue>,
  ref: ForwardedRef<DataTableHandle>
) {
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
  const tableRef = useRef<DataTableHandle>(null);
  const dialogRef = useRef<CrudDataTableDialogRef>(null);

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
    if (isPopulatedArray(props.defaultVisibleColumns)) {
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

  const handleOnCreateClick = onCreateSubmit
    ? () => dialogRef.current?.open()
    : undefined;

  let handleOnRowClick = onRowClick;
  if (handleOnRowClick === undefined && onUpdateSubmit) {
    handleOnRowClick = (row: TData) => dialogRef.current?.open(row);
  }

  return (
    <div className={cn("flex-1 py-4", className)}>
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

      <CrudDataTableDialog
        ref={dialogRef}
        dialogForm={dialogForm}
        renderFormFields={renderFormFields}
        onCreateSubmit={onCreateSubmit}
        onUpdateSubmit={onUpdateSubmit}
        onSubmitSuccess={() => tableRef.current?.refresh()}
      />
    </div>
  );
}
