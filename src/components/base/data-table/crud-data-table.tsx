'use client'

import {DataTable, DataTableHandle, DataTableProps} from "@/components/base/data-table/data-table";
import {Button} from "@/components/base/button";
import {FilterIcon, RefreshCw, Search} from "lucide-react";
import {Separator} from "@/components/base/separator";
import {ForwardedRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Input} from "@/components/base/input";
import {PaginationState} from "@tanstack/table-core";
import {cn, fixedForwardRef} from "@/lib/utils";
import {AutoField, AutoFormValueInfo} from "@/components/auto-field";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/base/popover";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/base/form";

export interface FiltersState {
    search?: string
    filters: { [key: string]: any }
}

interface CrudDataTableCreateButtonProps {
    enabled?: boolean,
    text?: string,
    onClick?: () => any
}

interface CrudDataTableSearchProps {
    enabled?: boolean,
    placeholder?: string
}

interface CrudDataTableFiltersProps {
    filtersInfo: { [key: string]: AutoFormValueInfo },
    onChange: (values: { [key: string]: any }) => Promise<any>,
}

interface CrudDataTableProps<TData, TValue> extends Omit<DataTableProps<TData, TValue>, 'fetcher'> {
    fetcher: (pagination: PaginationState, filters: FiltersState) => Promise<{ data: TData[], pageCount: number }>
    title?: string
    createButton?: CrudDataTableCreateButtonProps
    search?: CrudDataTableSearchProps
    filters?: CrudDataTableFiltersProps,
    hideRefresh?: boolean,
    className?: string
}

export const CrudDataTable = fixedForwardRef(CrudDataTableInternal);

function CrudDataTableInternal<TData, TValue>({
                                                  title,
                                                  createButton,
                                                  search,
                                                  filters,
                                                  hideRefresh,
                                                  className,
                                                  fetcher,
                                                  ...props
                                              }: CrudDataTableProps<TData, TValue>,
                                              ref: ForwardedRef<DataTableHandle>) {
    const [tableSearch, setTableSearch] = useState<string>("")
    const [tableFilters, setTableFilters] = useState<{ [key: string]: any }>({})
    const tableRef = useRef<DataTableHandle>(null);
    useImperativeHandle(ref, () => tableRef.current!, [tableRef]);

    function fetchWrapper(pagination: PaginationState) {
        return fetcher(pagination, {search: tableSearch, filters: tableFilters})
    }

    async function refresh() {
        tableRef.current?.refresh()
    }

    async function onFiltersChange(values: { [key: string]: any }) {
        setTableFilters(values)
        filters?.onChange(values)
    }

    useEffect(() => {
        tableRef.current?.resetPage()
        refresh();
    }, [tableFilters])

    return <div className={cn("flex-1", className)}>
        <div className="mb-2 flex justify-between">
            <div className={"flex items-center"}>
                {title && <div className='text-lg'>{title}</div>}
                {search?.enabled && <>
                    <form className="flex flex-row space-x-1" onSubmit={(e) => {
                        e.preventDefault();
                        console.log('submit')
                        tableRef.current?.refresh()
                    }}>
                        <Input
                            placeholder={search?.placeholder ?? 'Search...'}
                            value={tableSearch}
                            onChange={(event) => setTableSearch(event.target.value)}
                            className="max-w-sm"
                        />
                        <Button variant={"ghost"} type="submit"><Search/></Button>
                    </form>
                </>}
            </div>
            <div className={"flex space-x-4"}>
                {!hideRefresh && <>
                    <Button variant="ghost" onClick={refresh}><RefreshCw/></Button>
                </>}
                {filters && <FiltersPopover filtersInfo={filters.filtersInfo} onChange={onFiltersChange}/>}
                {(!hideRefresh || filters) &&
                    <Separator orientation={"vertical"}/>
                }
                {createButton?.enabled && <Button onClick={createButton?.onClick}>
                    {createButton?.text ?? 'Create'}
                </Button>}
            </div>
        </div>

        <DataTable ref={tableRef} {...props} fetcher={fetchWrapper}/>
    </div>
}

interface FiltersPopoverProps {
    filtersInfo: { [key: string]: AutoFormValueInfo },
    onChange: (values: { [key: string]: any }) => Promise<any>,
}

function FiltersPopover({filtersInfo, onChange}: FiltersPopoverProps) {
    const [open, setOpen] = useState(false);

    const keys = Object.keys(filtersInfo);

    const form = useForm({
        defaultValues: Object.fromEntries(keys.map(key => [key, filtersInfo[key]!.defaultValue ?? ""]))
    })

    async function internalSubmit(newValue: object) {
        console.log('submit', newValue)
        try {
            await onChange(newValue);
            setOpen(false)
        } catch (e) {
            console.error('Failed to update FiltersPopover', e)
        }
    }

    async function onReset() {
        form.reset(undefined, {keepDefaultValues: true})

        try {
            await onChange({});
            setOpen(false)
        } catch (e) {
            console.error('Failed to reset FiltersPopover', e)
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
        <PopoverContent className=''>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(internalSubmit)} className="space-y-8">
                    {keys.map(filterKey => {
                        return <AutoField key={filterKey} info={filtersInfo[filterKey]!}
                                          name={filterKey} control={form.control}/>
                    })}

                    <div className={"flex flex-row justify-end gap-2"}>
                        <Button onClick={onReset} type="reset" variant="outline" loading={form.formState.isSubmitting}>
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
}