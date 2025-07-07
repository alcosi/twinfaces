"use client";

import { PaginationState } from "@tanstack/table-core";
import { usePathname, useRouter } from "next/navigation";
import {
  ForwardedRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { UseFormReturn } from "react-hook-form";

import { PagedResponse } from "@/shared/api";
import {
  cn,
  fixedForwardRef,
  isPopulatedArray,
  useTraceUpdate,
} from "@/shared/libs";

import {
  DataTable,
  DataTableHandle,
  DataTableProps,
  DataTableRow,
} from "./data-table";
import { CrudDataTableDialog, CrudDataTableDialogRef } from "./dialog";
import { CrudDataTableHeader, CrudDataTableHeaderProps } from "./header";
import { getColumnKey, groupDataByKey } from "./helpers";
import { useViewSettings } from "./hooks";

type CrudDataTableProps<
  TData extends DataTableRow<TData>,
  TValue,
> = CrudDataTableHeaderProps &
  Omit<DataTableProps<TData, TValue>, "fetcher" | "getRowId"> & {
    className?: string;
    defaultVisibleColumns?: DataTableProps<TData, TValue>["columns"];
    orderedColumns?: DataTableProps<TData, TValue>["columns"];
    groupableColumns?: DataTableProps<TData, TValue>["columns"];
    dialogForm?: UseFormReturn<any>;
    onCreateSubmit?: (values: any) => Promise<void>;
    renderFormFields?: () => ReactNode;
    // === Overridden ===
    fetcher: (
      pagination: PaginationState,
      filters: { search?: string; filters: { [key: string]: any } }
    ) => Promise<PagedResponse<TData>>;
    getRowId: (row: TData) => string;
  };

export const CrudDataTable = fixedForwardRef(CrudDataTableInternal);

function CrudDataTableInternal<TData extends DataTableRow<TData>, TValue>(
  {
    className,
    fetcher,
    dialogForm,
    onCreateSubmit,
    renderFormFields,
    onRowClick,
    ...props
  }: CrudDataTableProps<TData, TValue>,
  ref: ForwardedRef<DataTableHandle>
) {
  const router = useRouter();
  const pathname = usePathname();

  const { viewSettings, updateViewSettings } = useViewSettings(
    props.defaultVisibleColumns,
    props.orderedColumns
  );
  const tableRef = useRef<DataTableHandle>(null);
  const dialogRef = useRef<CrudDataTableDialogRef>(null);
  const didMount = useRef(false);

  useImperativeHandle(ref, () => tableRef.current!, [tableRef]);

  useEffect(() => {
    if (didMount.current) {
      tableRef.current?.refresh();
    } else {
      didMount.current = true;
    }
  }, [
    viewSettings.query,
    viewSettings.filters,
    viewSettings.groupByKey,
    viewSettings.orderKeys,
    viewSettings.visibleKeys,
    viewSettings.layoutMode,
  ]);

  const fetchWrapper = useCallback(
    async (pagination: PaginationState) => {
      try {
        const response = await fetcher(pagination, {
          search: viewSettings.query,
          filters: viewSettings.filters,
        });

        if (viewSettings.groupByKey) {
          response.data = groupDataByKey(
            response.data,
            viewSettings.groupByKey
          );
        }

        return response;
      } catch (error) {
        console.error("Error in fetchWrapper:", error);
        throw error;
      }
    },
    [fetcher, viewSettings.query, viewSettings.filters, viewSettings.groupByKey]
  );

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

  const handleOnRowClick = useCallback(
    (row: TData) => {
      if (onRowClick) return onRowClick(row);

      const rowId = props.getRowId(row);
      const basePath = pathname.replace(/\/$/, "");
      router.push(`${basePath}/${rowId}`);
    },
    [onRowClick, pathname, props.getRowId]
  );

  useTraceUpdate({
    props: {
      className,
      fetcher,
      dialogForm,
      onCreateSubmit,
      renderFormFields,
      onRowClick,
      ...props,
    },
    componentName: "CrudDataTable",
  });

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
        layoutMode={viewSettings.layoutMode}
      />

      <CrudDataTableDialog
        ref={dialogRef}
        dialogForm={dialogForm}
        renderFormFields={renderFormFields}
        onCreateSubmit={onCreateSubmit}
        onSubmitSuccess={() => tableRef.current?.refresh()}
      />
    </div>
  );
}
