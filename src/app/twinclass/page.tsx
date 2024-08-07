'use client'

import {toast} from "sonner";
import {ColumnDef, PaginationState} from "@tanstack/table-core";
import {DataTable, DataTableHandle} from "@/components/base/data-table/data-table";
import {useContext, useEffect, useRef, useState} from "react";
import {BatteryWarning, Check, LinkIcon, RefreshCw, Search, Unplug} from "lucide-react";
import {TwinClass} from "@/lib/api/api-types";
import {TwinClassDialog, ClassDialogMode} from "@/app/twinclass/twin-class-dialog";
import {ApiContext} from "@/lib/api/api";
import Link from "next/link";
import {ShortGuidWithCopy} from "@/components/base/short-guid";
import {ImageWithFallback} from "@/components/ImageWithFallback";
import {CrudDataTable, FiltersState} from "@/components/base/data-table/crud-data-table";
import {useRouter} from "next/navigation";

const columns: ColumnDef<TwinClass>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: (data) => <ShortGuidWithCopy value={data.row.original.id}/>
    },
    {
        accessorKey: "logo",
        header: "Logo",
        cell: (data) => {
            const value = data.row.original.logo;
            return <ImageWithFallback src={value as string} alt={value as string} fallbackContent={<Unplug/>} width={32}
                                      height={32} className="text-[0]"/>;
        }
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
    //     header: "Actions",
    //     cell: (data) => {
    //         return <Link href={`/twinclass/${data.row.original.key}`}>
    //             <span className="inline-flex items-center"><LinkIcon className="mx-1"/> View</span>
    //         </Link>
    //     }
    // }
]

export default function TwinClasses() {
    const [classDialogOpen, setClassDialogOpen] = useState(false)

    const api = useContext(ApiContext)
    const router = useRouter()
    const tableRef = useRef<DataTableHandle>(null);

    async function fetchData(pagination: PaginationState, filters: FiltersState) {
        try {
            const {data, error} = await api.twinClass.search({pagination, search: filters?.search});
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
        } catch (e) {
            console.error('Exception when fetching classes', e)
            toast.error("Failed to fetch classes")
            return {
                data: [],
                pageCount: 0
            }
        }
    }

    function openCreateClass() {
        setClassDialogOpen(true)
    }

    return (
        <main className={"p-8 lg:flex lg:justify-center flex-col mx-auto"}>
            <div className="w-0 flex-0 lg:w-16"/>

            <CrudDataTable
                ref={tableRef}
                columns={columns}
                getRowId={(row) => row.id!}
                fetcher={fetchData}
                pageSizes={[10, 20, 50]}
                onRowClick={(row) => router.push(`/twinclass/${row.id}`)}
                createButton={{enabled: true, onClick: openCreateClass, text: 'Create Class'}}
                search={{enabled: true, placeholder: 'Search by key...'}}
            />

            <div className="w-0 flex-0 lg:w-16"/>

            <TwinClassDialog open={classDialogOpen}
                             onOpenChange={(newOpen) => {
                                 setClassDialogOpen(newOpen);
                             }}
                             onSuccess={() => tableRef.current?.refresh()}/>

        </main>
    );
}
