'use client'

import {toast} from "sonner";
import {ColumnDef, PaginationState} from "@tanstack/table-core";
import {DataTable, DataTableHandle} from "@/components/ui/data-table/data-table";
import {useContext, useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Check, RefreshCw, Search} from "lucide-react";
import {TwinClass} from "@/lib/api/api-types";
import {ClassDialog, ClassDialogMode} from "@/app/class-dialog";
import {ApiContext} from "@/lib/api/api";
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import Image from "next/image"
import {useRouter} from "next/navigation";
import Link from "next/link";
import {ExternalLinkIcon} from "@radix-ui/react-icons";

const columns: ColumnDef<TwinClass>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "logo",
        header: "Logo",
        cell: (data) => {
            const value = data.row.original.logo;
            if (!value) {
                return null;
            }
            return <Image  src={value as string} alt={value as string} width={32} height={32}/>;
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
            return <Link href={`/twinclass/${data.row.original.key}`} target='_blank'>
                <span className="inline-flex items-center"><ExternalLinkIcon className="mx-1"/> View</span>
            </Link>
        }
    }
    // {
    //     accessorKey: "createdAt",
    //     header: "Created At",
    // }
]

export default function Home() {
    const [classDialogOpen, setClassDialogOpen] = useState(false)
    const [classDialogMode, setClassDialogMode] = useState<ClassDialogMode>(ClassDialogMode.Create)
    const [selectedClass, setSelectedClass] = useState<TwinClass | undefined>(undefined)
    const [tableSearch, setTableSearch] = useState<string>("")

    const api = useContext(ApiContext)

    const tableRef = useRef<DataTableHandle>(null);

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
                        <Button onClick={() => {
                            setClassDialogOpen(true);
                            setClassDialogMode(ClassDialogMode.Create);
                        }}>
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
                         onOpenChange={(newOpen) => {
                             setClassDialogOpen(newOpen);
                             if (!newOpen) {
                                 setSelectedClass(undefined);
                             }
                         }}
                         twinClass={selectedClass}
                         onSuccess={() => tableRef.current?.refresh()}/>

        </main>
    );
}
