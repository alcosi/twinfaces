import { Plus, RefreshCw, Search } from "lucide-react";
import React, { ForwardedRef, useCallback, useEffect } from "react";

import { AutoFormValueInfo } from "@/components/auto-field";

import { debounce, fixedForwardRef, isPopulatedArray } from "@/shared/libs";
import { GridIcon, Input, RowsIcon } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";

import { DataTableHandle, DataTableProps, DataTableRow } from "../data-table";
import { getColumnKey, safeRefresh } from "../helpers";
import { useViewSettings } from "../hooks";
import { ColumnManagerPopover } from "./column-manger-popover";
import { FiltersPopover } from "./filters-popover";
import { GroupByButton } from "./group-by-button";

export type TableViewState = {
  query: string;
  filters: Record<string, any>;
  visibleKeys: string[];
  orderKeys: string[];
  groupByKey: string | undefined;
  layoutMode: "grid" | "rows";
};

export type CrudDataTableHeaderProps = {
  title?: string;
  search?: {
    enabled?: boolean;
    placeholder?: string;
  };
  filters?: {
    filtersInfo: { [key: string]: AutoFormValueInfo };
  };
  hideRefresh?: boolean;
  onCreateClick?: () => void;
  onViewSettingsChange?: (data: TableViewState) => void;
};

type Props<
  TData extends DataTableRow<TData>,
  TValue,
> = CrudDataTableHeaderProps & {
  columns: DataTableProps<TData, TValue>["columns"];
  defaultVisibleColumns?: DataTableProps<TData, TValue>["columns"];
  orderedColumns?: DataTableProps<TData, TValue>["columns"];
  groupableColumns?: DataTableProps<TData, TValue>["columns"];
};

function CrudDataTableHeaderComponent<
  TData extends DataTableRow<TData>,
  TValue,
>(
  {
    title,
    search,
    hideRefresh,
    filters,
    columns,
    defaultVisibleColumns,
    orderedColumns,
    groupableColumns,
    onCreateClick,
    onViewSettingsChange,
  }: Props<TData, TValue>,
  tableRef: ForwardedRef<DataTableHandle>
) {
  const { viewSettings, updateViewSettings } = useViewSettings(
    defaultVisibleColumns,
    orderedColumns
  );

  const debouncedUpdate = useCallback(
    debounce(
      (updates: Partial<TableViewState>) => updateViewSettings(updates),
      150
    ),
    []
  );

  useEffect(() => {
    onViewSettingsChange?.(viewSettings);
  }, [viewSettings, onViewSettingsChange]);

  function handleOnSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    safeRefresh(tableRef);
  }

  const visibleOrderedColumns = columns
    .map((column) => {
      return {
        id: getColumnKey(column),
        name: column.header as string,
        visible: viewSettings.visibleKeys.includes(getColumnKey(column)),
      };
    })
    .sort(
      (a, b) =>
        viewSettings.orderKeys.indexOf(a.id) -
        viewSettings.orderKeys.indexOf(b.id)
    );

  return (
    <div className="mb-2 flex justify-between">
      <div className="flex items-center">
        {title && <div className="text-lg">{title}</div>}
        {search?.enabled && (
          <form className="flex flex-row space-x-1" onSubmit={handleOnSearch}>
            <Input
              placeholder={search?.placeholder ?? "Search..."}
              value={viewSettings.query}
              onChange={(e) => debouncedUpdate({ query: e.target.value })}
              className="max-w-sm"
            />
            <Button variant="ghost" type="submit">
              <Search />
            </Button>
          </form>
        )}
      </div>
      <div className="flex space-x-4">
        {!hideRefresh && (
          <Button
            variant="ghost"
            onClick={() => {
              safeRefresh(tableRef);
            }}
          >
            <RefreshCw />
          </Button>
        )}

        {filters && (
          <FiltersPopover
            filtersInfo={filters.filtersInfo}
            onChange={async (filters) => debouncedUpdate({ filters })}
          />
        )}

        {isPopulatedArray(defaultVisibleColumns) && (
          <ColumnManagerPopover
            columns={visibleOrderedColumns}
            sortKeys={viewSettings.orderKeys}
            onVisibleChange={(visibleKeys) =>
              updateViewSettings({ visibleKeys })
            }
            onSortChange={(orderKeys) => debouncedUpdate({ orderKeys })}
            onReset={() =>
              updateViewSettings({
                visibleKeys: defaultVisibleColumns.map(getColumnKey),
              })
            }
          />
        )}

        {isPopulatedArray(groupableColumns) && (
          <GroupByButton
            columns={groupableColumns}
            onGroupByChange={(groupByKey) => debouncedUpdate({ groupByKey })}
          />
        )}

        <Button
          IconComponent={
            viewSettings.layoutMode === "grid"
              ? () => <GridIcon className="h-6 w-6" />
              : () => <RowsIcon className="h-6 w-6" />
          }
          onClick={() =>
            updateViewSettings({
              layoutMode: viewSettings.layoutMode === "grid" ? "rows" : "grid",
            })
          }
        />

        {onCreateClick && (
          <>
            <Separator orientation="vertical" />
            <Button onClick={onCreateClick}>
              <Plus />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export const CrudDataTableHeader = fixedForwardRef(
  CrudDataTableHeaderComponent
);
