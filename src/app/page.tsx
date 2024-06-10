'use client'

import {toast} from "sonner";
import {ColumnDef, PaginationState} from "@tanstack/table-core";
import {DataTable, DataTableHandle} from "@/components/ui/data-table/data-table";
import {paths, components} from "@/lib/api/generated/schema";
import createClient from "openapi-fetch";
import {useRef} from "react";
import {Button} from "@/components/ui/button";
import {RefreshCw} from "lucide-react";

type TwinClassV1 = components["schemas"]["TwinClassV1"];

const columns: ColumnDef<TwinClassV1>[] = [
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
        accessorKey: "createdAt",
        header: "Created At",
    }
]

export default function Home() {
    const domain = "9fc7e7df-db3b-4c46-9cbf-063dcdc146af";
    const user = "608c6d7d-99c8-4d87-89c6-2f72d0f5d673";
    const channel = "WEB";

    const tableRef = useRef<DataTableHandle>(null);

    async function fetchData(pagination: PaginationState) {
        const client = createClient<paths>({baseUrl: 'http://localhost:10321'})

        // wait a few seconds for test
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const {data, error} = await client.POST('/private/twin_class/search/v1', {
            params: {
                header: {
                    DomainId: domain,
                    AuthToken: user,
                    Channel: channel
                },
                query: {
                    showClassMode: 'DETAILED',
                    showStatusMode: 'SHORT',
                    limit: pagination.pageSize,
                    offset: pagination.pageIndex * pagination.pageSize
                }
            },
            body: {}
        })

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
        <main className={"p-8"}>
            <div style={{"maxWidth": 900}}>
                <div className={"mb-2 flex justify-end space-x-2"}>
                    <Button onClick={() => tableRef.current?.refresh()}><RefreshCw/></Button>
                    <Button>
                        Create class
                    </Button>
                </div>
                <DataTable ref={tableRef}
                           columns={columns}
                           fetcher={fetchData}
                           pageSizes={[10, 20, 50]}
                />
            </div>
        </main>
    );
}
