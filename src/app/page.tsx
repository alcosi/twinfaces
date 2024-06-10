'use client'

import {toast} from "sonner";
import {ColumnDef, PaginationState} from "@tanstack/table-core";
import {DataTable, DataTableHandle} from "@/components/ui/data-table/data-table";
import {paths, components} from "@/lib/api/generated/schema";
import createClient from "openapi-fetch";
import {useContext, useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Check, RefreshCw} from "lucide-react";
import {TwinClass} from "@/lib/api/api-types";
import {ClassDialog} from "@/app/class-dialog";
import {ApiContext} from "@/lib/api/api";
import {Input} from "@/components/ui/input";

const columns: ColumnDef<TwinClass>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "key",
        header: "Key",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "abstractClass",
        header: "Abstract",
        cell: (data) => <>{data.getValue() && <Check/>}</>
    },
    // {
    //     accessorKey: "createdAt",
    //     header: "Created At",
    // }
]

export default function Home() {
    const [classDialogOpen, setClassDialogOpen] = useState(false)
    const [tableSearch, setTableSearch] = useState<string | undefined>(undefined)

    const api = useContext(ApiContext)

    const tableRef = useRef<DataTableHandle>(null);

    useEffect(() => {
        tableRef.current?.refresh()
    }, [tableSearch])

    async function fetchData(pagination: PaginationState) {
        const {data, error} = await api.twinClass.search({pagination, search: tableSearch});

        if (error) {
            console.error('failed to fetch classes', error)
            toast.error("Failed to fetch classes")
            return {
                data: [],
                pageCount: 0
            }
        }

        return {
            data: data.twinClassList ?? [],
            pageCount: Math.ceil((data.pagination?.total ?? 0) / pagination.pageSize)
        }
    }

    return (
        <main className={"p-8 lg:flex lg:justify-center"}>
            <div className="w-0 flex-0 lg:w-16"/>
            <div className="flex-1">
                <div className="mb-2 flex justify-between">
                    <Input
                        placeholder="Search by key..."
                        value={tableSearch}
                        onChange={(event) => setTableSearch(event.target.value)}
                        className="max-w-sm"
                    />
                    <div className={"flex space-x-2"}>
                        <Button onClick={() => tableRef.current?.refresh()}><RefreshCw/></Button>
                        <Button onClick={() => setClassDialogOpen(true)}>
                            Create class
                        </Button>
                    </div>
                </div>
                <DataTable ref={tableRef}
                           columns={columns}
                           fetcher={fetchData}
                           pageSizes={[10, 20, 50]}
                />
            </div>
            <div className="w-0 flex-0 lg:w-16"/>

            <ClassDialog open={classDialogOpen}
                         onOpenChange={(newOpen) => setClassDialogOpen(newOpen)}
                         onSuccess={() => tableRef.current?.refresh()}/>
        </main>
    );
}