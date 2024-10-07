import {CrudDataTable, FiltersState} from "@/components/base/data-table/crud-data-table";
import {useContext, useRef, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {TwinClassContext} from "@/app/twinclass/[twinClassId]/twin-class-context";
import {DataTableHandle} from "@/components/base/data-table/data-table";
import {TwinClassLink} from "@/lib/api/api-types";
import {ColumnDef, PaginationState} from "@tanstack/table-core";
import {toast} from "sonner";
import {ShortGuidWithCopy} from "@/components/base/short-guid";
import {LoadingOverlay} from "@/components/base/loading";
import {TwinLinkDialog} from "@/entities/twinLink/components/twin-link-dialog";

export function TwinClassLinks() {
    const api = useContext(ApiContext);
    const { twinClass } = useContext(TwinClassContext);
    const tableRefForward = useRef<DataTableHandle>(null);
    const tableRefBackward = useRef<DataTableHandle>(null);

    const [dialogOpen, setDialogOpen] = useState(false);

    const columns: ColumnDef<TwinClassLink>[] = [
        {
            accessorKey: "id",
            header: "Id",
            cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()}/>
        },
        {
            accessorKey: "dstTwinClassId",
            header: "Destination Twin Class",
            cell: (data) => <ShortGuidWithCopy value={data.getValue<string>()}/>
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "type",
            header: "Type",
        },
        {
            accessorKey: "linkStrengthId",
            header: "Link Strength",
        },
    ];

    async function fetchLinks(type: 'forward' | 'backward', _: PaginationState, filters: FiltersState) {
        if (!twinClass?.id) {
            toast.error("Twin class ID is missing");
            return { data: [], pageCount: 0 };
        }

        try {
            const response = await api.twinLinks.getLinks({ twinClassId: twinClass.id });
            const data = response.data;

            if (!data || data.status != 0) {
                console.error('failed to fetch twin class links', data);
                let message = "Failed to load twin class links";
                if (data?.msg) message += `: ${data.msg}`;
                toast.error(message);
                return {data: [], pageCount: 0};
            }

            return {
                data: type === 'forward'
                    ? Object.values(data.forwardLinkMap || {}) : Object.values(data.backwardLinkMap || {}),
                pageCount: 0
            };

        } catch (e) {
            console.error(`Failed to fetch twin class ${type} links`, e);
            toast.error(`Failed to fetch twin class ${type} links`);
            return { data: [], pageCount: 0 };
        }
    }

    if (!twinClass) {
        return <LoadingOverlay/>;
    }

    return (
        <>
            <CrudDataTable
                className="mb-10"
                ref={tableRefForward}
                title="Forward Links"
                columns={columns}
                getRowId={(row) => row.id!}
                fetcher={(paginationState, filters) => fetchLinks('forward', paginationState, filters)}
                createButton={{
                    enabled: true,
                    onClick: () => setDialogOpen(true),
                }}
                disablePagination={true}
                pageSizes={[10, 20, 50]}
                customizableColumns={{
                    enabled: true,
                    defaultVisibleKeys: ['id', 'linkStrengthId', 'name', 'type', 'dstTwinClassId'],
                }}
            />

            <CrudDataTable
                ref={tableRefBackward}
                title="Backward Links"
                columns={columns}
                getRowId={(row) => row.id!}
                fetcher={(paginationState, filters) => fetchLinks('backward', paginationState, filters)}
                createButton={{
                    enabled: true,
                    onClick: () => setDialogOpen(true),
                }}
                disablePagination={true}
                pageSizes={[10, 20, 50]}
                customizableColumns={{
                    enabled: true,
                    defaultVisibleKeys: ['id', 'linkStrengthId', 'name', 'type', 'dstTwinClassId'],
                }}
            />

            {twinClass?.id && (
                <TwinLinkDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    twinId={twinClass?.id}
                    // link={null} // null for new link, pass existing link for editing
                    onSuccess={() => {
                        // Refresh the links or table after successful submission
                    }}
                />
            )}
        </>
    );
}
