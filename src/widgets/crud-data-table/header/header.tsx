import { AutoFormValueInfo } from "@/components/auto-field";
import { Button } from "@/components/base/button";
import { CustomizableColumnsPopover } from "@/components/base/data-table/crud-data-table-columns-popover";
import {
  DataTableHandle,
  DataTableProps,
  DataTableRow,
} from "@/components/base/data-table/data-table";
import { Input } from "@/components/base/input";
import { Separator } from "@/components/base/separator";
import { debounce, fixedForwardRef, isFullArray } from "@/shared/libs";
import { Plus, RefreshCw, Search } from "lucide-react";
import React, { ForwardedRef, useCallback, useEffect, useReducer } from "react";
import { getColumnKey, safeRefresh } from "../helpers";
import { FiltersPopover } from "./filters-popover";
import { GroupByButton } from "./group-by-button";

export type FilterState = {
  query: string;
  filters: Record<string, any>;
  visibleKeys: string[];
  orderKeys: string[];
  groupByKey: string | undefined;
};

export type CrudDataTableHeaderProps = {
  title?: string;
  search?: {
    enabled?: boolean;
    placeholder?: string;
  };
  filters?: {
    filtersInfo: { [key: string]: AutoFormValueInfo };
    onChange: (values: { [key: string]: any }) => Promise<any>;
  };
  hideRefresh?: boolean;
  onCreateClick?: () => void;
  onViewSettingsChange?: (data: FilterState) => void;
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

const initialSettings = <TData extends DataTableRow<TData>, TValue>(
  orderedColumns: Props<TData, TValue>["orderedColumns"],
  visibleColumns?: Props<TData, TValue>["defaultVisibleColumns"]
): FilterState => ({
  query: "",
  filters: {},
  visibleKeys: visibleColumns?.map((col) => getColumnKey(col)) ?? [],
  orderKeys: orderedColumns?.map((col) => getColumnKey(col)) ?? [],
  groupByKey: undefined,
});

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
  const [viewSettings, updateViewSettings] = useReducer(
    (state: FilterState, updates: Partial<FilterState>) => ({
      ...state,
      ...updates,
    }),
    initialSettings(orderedColumns, defaultVisibleColumns)
  );

  const debouncedUpdate = useCallback(
    debounce(
      (updates: Partial<FilterState>) => updateViewSettings(updates),
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

        {isFullArray(defaultVisibleColumns) && (
          <CustomizableColumnsPopover
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

        {isFullArray(groupableColumns) && (
          <GroupByButton
            columns={groupableColumns}
            onGroupByChange={(groupByKey) => debouncedUpdate({ groupByKey })}
          />
        )}

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
