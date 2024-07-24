'use client'

import {DataTable, DataTableHandle, DataTableProps} from "@/components/base/data-table/data-table";
import {Button} from "@/components/base/button";
import {RefreshCw, Search} from "lucide-react";
import {Separator} from "@/components/base/separator";
import {ForwardedRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Input} from "@/components/base/input";
import {PaginationState} from "@tanstack/table-core";
import {cn, fixedForwardRef} from "@/lib/utils";

export interface FiltersState {
    search?: string
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

interface CrudDataTableProps<TData, TValue> extends Omit<DataTableProps<TData, TValue>, 'fetcher'> {
    fetcher: (pagination: PaginationState, filters: FiltersState) => Promise<{ data: TData[], pageCount: number }>
    title?: string
    createButton?: CrudDataTableCreateButtonProps
    search?: CrudDataTableSearchProps
    hideRefresh?: boolean,
    className?: string
}

export const CrudDataTable = fixedForwardRef(CrudDataTableInternal);

function CrudDataTableInternal<TData, TValue>({
                                                  title,
                                                  createButton,
                                                  search,
                                                  hideRefresh,
                                                  className,
                                                  fetcher,
                                                  ...props
                                              }: CrudDataTableProps<TData, TValue>,
                                              ref: ForwardedRef<DataTableHandle>) {
    const [tableSearch, setTableSearch] = useState<string>("")
    const tableRef = useRef<DataTableHandle>(null);
    useImperativeHandle(ref, () => tableRef.current!, [tableRef]);

    function fetchWrapper(pagination: PaginationState) {
        return fetcher(pagination, {search: tableSearch})
    }

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
                    <Button variant="ghost" onClick={() => tableRef.current?.refresh()}><RefreshCw/></Button>
                    <Separator orientation={"vertical"}/>
                </>}
                {createButton?.enabled && <Button onClick={createButton?.onClick}>
                    {createButton?.text ?? 'Create'}
                </Button>}
            </div>
        </div>

        <DataTable ref={tableRef} {...props} fetcher={fetchWrapper}/>
    </div>
}