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
import { debounce, fixedForwardRef } from "@/shared/libs";
import { RefreshCw, Search } from "lucide-react";
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
  customizableColumns?: {
    enabled?: boolean;
    defaultVisibleKeys?: string[];
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
};

const initialSettings = <TData extends DataTableRow<TData>, TValue>(
  columns: Props<TData, TValue>["columns"],
  customizableColumns?: CrudDataTableHeaderProps["customizableColumns"]
): FilterState => ({
  query: "",
  filters: {},
  visibleKeys: customizableColumns?.defaultVisibleKeys ?? [],
  orderKeys: columns.map((col) => getColumnKey(col)),
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
    customizableColumns,
    columns,
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
    initialSettings(columns, customizableColumns)
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
    .map((column) => ({
      id: getColumnKey(column),
      name: column.header as string,
      visible: viewSettings.visibleKeys.includes(getColumnKey(column)),
    }))
    .sort(
      (a, b) =>
        viewSettings.orderKeys.indexOf(a.id) -
        viewSettings.orderKeys.indexOf(b.id)
    );

  const groupByColumns = columns.filter((column) => {
    return visibleOrderedColumns.find(({ id }) => column.id === id)?.visible;
  });

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

        {customizableColumns?.enabled && (
          <CustomizableColumnsPopover
            columns={visibleOrderedColumns}
            sortKeys={viewSettings.orderKeys}
            onVisibleChange={(visibleKeys) =>
              updateViewSettings({ visibleKeys })
            }
            onSortChange={(orderKeys) => debouncedUpdate({ orderKeys })}
            onReset={() =>
              updateViewSettings({
                visibleKeys: customizableColumns.defaultVisibleKeys ?? [],
              })
            }
          />
        )}

        {groupByColumns.length > 0 && (
          <GroupByButton
            columns={columns}
            onGroupByChange={(groupByKey) => debouncedUpdate({ groupByKey })}
          />
        )}

        {onCreateClick && (
          <>
            <Separator orientation="vertical" />
            <Button onClick={onCreateClick}>Create</Button>
          </>
        )}
      </div>
    </div>
  );
}

export const CrudDataTableHeader = fixedForwardRef(
  CrudDataTableHeaderComponent
);
