"use client";

// TODO: Refactor CrudDataTableHeader to Decouple Modal from Create Action
// Jira: https://alcosi.atlassian.net/browse/TWINFACES-593
// This component currently forces the use of a modal for the "create" flow.
// It should be refactored to allow consumers to define custom create behavior
// (e.g., opening a modal, navigating to a page, showing a drawer, etc.).
import { PaginationState } from "@tanstack/table-core";
import { usePathname, useRouter } from "next/navigation";
import {
  ForwardedRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { UseFormReturn } from "react-hook-form";

import { PagedResponse } from "@/shared/api";
import { cn, fixedForwardRef, isPopulatedArray } from "@/shared/libs";

import { DEFAULT_PAGE_SIZES } from "./constans";
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
    modalTitle?: string;
    submitButtonLabel?: string;
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
    pageSizes = DEFAULT_PAGE_SIZES,
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

  function handleOnRowClick(row: TData) {
    if (onRowClick) {
      return onRowClick(row);
    }

    const rowId = props.getRowId(row);
    const basePath = pathname.replace(/\/$/, "");

    router.push(`${basePath}/${rowId}`);
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
        pageSizes={pageSizes}
        onRowClick={handleOnRowClick}
        layoutMode={viewSettings.layoutMode}
      />

      <CrudDataTableDialog
        ref={dialogRef}
        dialogForm={dialogForm}
        renderFormFields={renderFormFields}
        onCreateSubmit={onCreateSubmit}
        onSubmitSuccess={() => tableRef.current?.refresh()}
        title={props.modalTitle}
        submitButtonLabel={props.submitButtonLabel}
      />
    </div>
  );
}
