'use client'

import {toast} from "sonner";
import {ColumnDef, PaginationState} from "@tanstack/table-core";
import {DataTable, DataTableHandle} from "@/components/base/data-table/data-table";
import {useContext, useEffect, useRef, useState} from "react";
import {Button} from "@/components/base/button";
import {Check, LinkIcon, RefreshCw, Search} from "lucide-react";
import {TwinClass} from "@/lib/api/api-types";
import {TwinClassDialog, ClassDialogMode} from "@/app/twinclass/twin-class-dialog";
import {ApiContext} from "@/lib/api/api";
import {Input} from "@/components/base/input";
import {Separator} from "@/components/base/separator";
import Image from "next/image"
import Link from "next/link";
import {ShortGuidWithCopy} from "@/components/base/short-guid";

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
            if (!value) {
                return <></>;
            }
            return <Image src={value as string} alt={value as string} width={32} height={32} className="text-[0]"/>;
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
    {
        header: "Actions",
        cell: (data) => {
            return <Link href={`/twinclass/${data.row.original.key}`}>
                <span className="inline-flex items-center"><LinkIcon className="mx-1"/> View</span>
            </Link>
        }
    }
]

export default function TwinClasses() {
    const [classDialogOpen, setClassDialogOpen] = useState(false)
    // const [selectedClass, setSelectedClass] = useState<TwinClass | undefined>(undefined)
    const [tableSearch, setTableSearch] = useState<string>("")

    const api = useContext(ApiContext)

    const tableRef = useRef<DataTableHandle>(null);

    async function fetchData(pagination: PaginationState) {
        try {
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
        } catch(e) {
            console.error('Exception when fetching classes', e)
            toast.error("Failed to fetch classes")
            return {
                data: [],
                pageCount: 0
            }
        }
    }

    function openCreateClass() {
        // setSelectedClass(undefined)
        setClassDialogOpen(true)
    }

    return (
        <main className={"p-8 lg:flex lg:justify-center flex-col"}>
            <div className="w-0 flex-0 lg:w-16"/>
            <div className="flex-1">
                <div className="mb-2 flex justify-between">
                    <form className="flex flex-row space-x-1" onSubmit={(e) => {
                        e.preventDefault();
                        console.log('submit')
                        tableRef.current?.refresh()
                    }}>
                        <Input
                            placeholder="Search by key..."
                            value={tableSearch}
                            onChange={(event) => setTableSearch(event.target.value)}
                            className="max-w-sm"
                        />
                        <Button variant={"ghost"} type="submit"><Search/></Button>
                    </form>
                    <div className={"flex space-x-4"}>
                        <Button variant="ghost" onClick={() => tableRef.current?.refresh()}><RefreshCw/></Button>
                        <Separator orientation={"vertical"}/>
                        <Button onClick={openCreateClass}>
                            Create class
                        </Button>
                    </div>
                </div>
                <DataTable ref={tableRef}
                           columns={columns}
                           getRowId={(row) => row.key!}
                           fetcher={fetchData}
                           pageSizes={[10, 20, 50]}
                />
            </div>
            <div className="w-0 flex-0 lg:w-16"/>

            <TwinClassDialog open={classDialogOpen}
                             onOpenChange={(newOpen) => {
                             setClassDialogOpen(newOpen);
                         }}
                // twinClass={selectedClass}
                             onSuccess={() => tableRef.current?.refresh()}/>

        </main>
    );
}
