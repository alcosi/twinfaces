import { AutoFormValueInfo } from "@/components/auto-field";
import { Button } from "@/components/base/button";
import { CustomizableColumnsPopover } from "@/components/base/data-table/crud-data-table-columns-popover";
import { Input } from "@/components/base/input";
import { Separator } from "@/components/base/separator";
import { RefreshCw, Search } from "lucide-react";
import React from "react";
import { FiltersPopover } from "./filters-popover";

interface CrudDataTableHeaderProps {
  title?: string;
  search?: {
    enabled?: boolean;
    placeholder?: string;
  };
  onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  tableSearch: string;
  setTableSearch: (value: string) => void;
  hideRefresh?: boolean;
  filters?: {
    filtersInfo: { [key: string]: AutoFormValueInfo };
    onChange: (values: { [key: string]: any }) => Promise<any>;
  };
  onFiltersChange: (values: { [key: string]: any }) => Promise<void>;
  refresh: () => void;
  customizableColumns?: {
    enabled?: boolean;
    defaultVisibleKeys?: string[];
  };
  columns: any[];
  visibleColumnKeys: string[];
  setVisibleColumnKeys: (columns: string[]) => void;
  sortColumnKeys: string[];
  setSortColumnKeys: (columns: string[]) => void;
  onCreateClick: () => void;
}

export function CrudDataTableHeader({
  title,
  search,
  onSearch,
  tableSearch,
  setTableSearch,
  hideRefresh,
  filters,
  onFiltersChange,
  refresh,
  customizableColumns,
  columns,
  visibleColumnKeys,
  setVisibleColumnKeys,
  sortColumnKeys,
  setSortColumnKeys,
  onCreateClick,
}: CrudDataTableHeaderProps) {
  return (
    <div className="mb-2 flex justify-between">
      <div className="flex items-center">
        {title && <div className="text-lg">{title}</div>}
        {search?.enabled && (
          <form className="flex flex-row space-x-1" onSubmit={onSearch}>
            <Input
              placeholder={search?.placeholder ?? "Search..."}
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
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
          <Button variant="ghost" onClick={refresh}>
            <RefreshCw />
          </Button>
        )}
        {filters && (
          <FiltersPopover
            filtersInfo={filters.filtersInfo}
            onChange={onFiltersChange}
          />
        )}
        {customizableColumns?.enabled && (
          <CustomizableColumnsPopover
            columns={columns
              .map((column) => ({
                id: getColumnKey(column),
                name: column.header,
                visible: visibleColumnKeys.includes(getColumnKey(column)),
              }))
              .sort(
                (a, b) =>
                  sortColumnKeys.indexOf(a.id) - sortColumnKeys.indexOf(b.id)
              )}
            sortKeys={sortColumnKeys}
            onVisibleChange={setVisibleColumnKeys}
            onSortChange={setSortColumnKeys}
            onReset={() =>
              setVisibleColumnKeys(customizableColumns.defaultVisibleKeys ?? [])
            }
          />
        )}
        <Separator orientation="vertical" />
        <Button onClick={onCreateClick}>Create</Button>
      </div>
    </div>
  );
}

function getColumnKey(column: any): string {
  return column.accessorKey ?? column.id;
}
