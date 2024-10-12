"use client";

import { AutoField, AutoFormValueInfo } from "@/components/auto-field";
import { Button } from "@/components/base/button";
import { CustomizableColumnsPopover } from "@/components/base/data-table/crud-data-table-columns-popover";
import {
  DataTable,
  DataTableHandle,
  DataTableProps,
} from "@/components/base/data-table/data-table";
import { Form } from "@/components/base/form";
import { Input } from "@/components/base/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { Separator } from "@/components/base/separator";
import { cn, fixedForwardRef } from "@/lib/utils";
import { PaginationState } from "@tanstack/table-core";
import { FilterIcon, RefreshCw, Search } from "lucide-react";
import {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";

export interface FiltersState {
  search?: string;
  filters: { [key: string]: any };
}

interface CrudDataTableCreateButtonProps {
  enabled?: boolean;
  text?: string;
  onClick?: () => any;
}

interface CrudDataTableSearchProps {
  enabled?: boolean;
  placeholder?: string;
}

interface CrudDataTableFiltersProps {
  filtersInfo: { [key: string]: AutoFormValueInfo };
  // eslint-disable-next-line no-unused-vars
  onChange: (values: { [key: string]: any }) => Promise<any>;
}

interface CrudDataTableCustomizableColumnsProps {
  enabled?: boolean;
  defaultVisibleKeys?: string[];
}

interface CrudDataTableProps<TData, TValue>
  extends Omit<DataTableProps<TData, TValue>, "fetcher"> {
  fetcher: (
    // eslint-disable-next-line no-unused-vars
    pagination: PaginationState,
    // eslint-disable-next-line no-unused-vars
    filters: FiltersState
  ) => Promise<{ data: TData[]; pageCount: number }>;
  title?: string;
  createButton?: CrudDataTableCreateButtonProps;
  search?: CrudDataTableSearchProps;
  filters?: CrudDataTableFiltersProps;
  customizableColumns?: CrudDataTableCustomizableColumnsProps;
  hideRefresh?: boolean;
  className?: string;
}

export const CrudDataTable = fixedForwardRef(CrudDataTableInternal);

function CrudDataTableInternal<TData, TValue>(
  {
    title,
    createButton,
    search,
    filters,
    customizableColumns,
    hideRefresh,
    className,
    fetcher,
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

  function onVisibleColumnsChange(columns: string[]) {
    console.log("onVisibleColumnsChange", columns);
    setVisibleColumnKeys(columns);
  }

  function onSortColumnsChange(columns: string[]) {
    console.log("onSortColumnsChange", columns);
    setSortColumnKeys(columns);
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

  function getColumnKey(column: any) {
    return column.accessorKey ? (column.accessorKey as string) : column.id!;
  }

  return (
    <div className={cn("flex-1", className)}>
      <div className="mb-2 flex justify-between">
        <div className={"flex items-center"}>
          {title && <div className="text-lg">{title}</div>}
          {search?.enabled && (
            <>
              <form
                className="flex flex-row space-x-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("submit");
                  tableRef.current?.refresh();
                }}
              >
                <Input
                  placeholder={search?.placeholder ?? "Search..."}
                  value={tableSearch}
                  onChange={(event) => setTableSearch(event.target.value)}
                  className="max-w-sm"
                />
                <Button variant={"ghost"} type="submit">
                  <Search />
                </Button>
              </form>
            </>
          )}
        </div>
        <div className={"flex space-x-4"}>
          {!hideRefresh && (
            <>
              <Button variant="ghost" onClick={refresh}>
                <RefreshCw />
              </Button>
            </>
          )}
          {filters && (
            <FiltersPopover
              filtersInfo={filters.filtersInfo}
              onChange={onFiltersChange}
            />
          )}
          {customizableColumns?.enabled && (
            <CustomizableColumnsPopover
              columns={props.columns
                .map((column) => {
                  var columnAsAny = column as any;
                  if (columnAsAny.accessorKey) {
                    return {
                      id: columnAsAny.accessorKey as string,
                      name: column.header as string,
                      visible: visibleColumnKeys.includes(
                        columnAsAny.accessorKey as string
                      ),
                    };
                  } else {
                    return {
                      id: column.id as string,
                      name: column.header as string,
                      visible: visibleColumnKeys.includes(column.id as string),
                    };
                  }
                })
                .sort((a, b) => {
                  return (
                    sortColumnKeys.indexOf(a.id) - sortColumnKeys.indexOf(b.id)
                  );
                })}
              sortKeys={sortColumnKeys}
              onVisibleChange={onVisibleColumnsChange}
              onSortChange={onSortColumnsChange}
              onReset={() =>
                setVisibleColumnKeys(
                  customizableColumns.defaultVisibleKeys ?? []
                )
              }
            />
          )}
          {(!hideRefresh || filters) && <Separator orientation={"vertical"} />}
          {createButton?.enabled && (
            <Button onClick={createButton?.onClick}>
              {createButton?.text ?? "Create"}
            </Button>
          )}
        </div>
      </div>

      <DataTable
        ref={tableRef}
        {...props}
        columns={visibleColumns}
        fetcher={fetchWrapper}
      />
    </div>
  );
}

interface FiltersPopoverProps {
  filtersInfo: { [key: string]: AutoFormValueInfo };
  // eslint-disable-next-line no-unused-vars
  onChange: (values: { [key: string]: any }) => Promise<any>;
}

function FiltersPopover({ filtersInfo, onChange }: FiltersPopoverProps) {
  const [open, setOpen] = useState(false);

  const keys = Object.keys(filtersInfo);

  const form = useForm({
    defaultValues: Object.fromEntries(
      keys.map((key) => [key, filtersInfo[key]!.defaultValue ?? ""])
    ),
  });

  async function internalSubmit(newValue: object) {
    console.log("submit", newValue);
    try {
      await onChange(newValue);
      setOpen(false);
    } catch (e) {
      console.error("Failed to update FiltersPopover", e);
    }
  }

  async function onReset() {
    form.reset(undefined, { keepDefaultValues: true });

    try {
      await onChange({});
      setOpen(false);
    } catch (e) {
      console.error("Failed to reset FiltersPopover", e);
    }
  }

    return <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
                type='button'
                className={cn('block'/*, className*/)}
                // name={name}
                onClick={() => {
                    setOpen(true);
                }}
                variant='default'
            >
                <FilterIcon/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='max-h-[80vh] overflow-y-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(internalSubmit)} className="space-y-4">
                    {keys.map(filterKey => {
                        return <AutoField key={filterKey} info={filtersInfo[filterKey]!}
                                          name={filterKey} control={form.control}/>
                    })}

            <div className={"flex flex-row justify-end gap-2"}>
              <Button
                onClick={onReset}
                type="reset"
                variant="outline"
                loading={form.formState.isSubmitting}
              >
                Clear
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Apply
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
