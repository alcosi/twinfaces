import {TwinClass, TwinClassStatus} from "@/lib/api/api-types";
import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {toast} from "sonner";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Edit2Icon} from "lucide-react";
import CreateEditTwinStatusDialog from "@/app/twinclass/[key]/twin-status-dialog";

export function TwinClassStatuses({twinClass}: { twinClass: TwinClass }) {
    const api = useContext(ApiContext);

    const [statuses, setStatuses] = useState<string[]>([]);
    const [statusesMap, setStatusesMap] = useState<{ [p: string]: TwinClassStatus }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [createEditStatusDialogOpen, setCreateEditStatusDialogOpen] = useState<boolean>(false);
    const [editedStatus, setEditedStatus] = useState<TwinClassStatus | null>(null);

    useEffect(() => {
        fetchData();
    }, [])

    function fetchData() {
        if (!twinClass.id) {
            toast.error("Twin class ID is missing");
            return;
        }

        setLoading(true);
        api.twinClass.getById({
            id: twinClass.id, query: {
                showTwinClassMode: 'SHORT',
                // showTwin2TwinClassMode: 'SHORT',
                showTwin2StatusMode: 'DETAILED',
                showTwinClass2StatusMode: 'DETAILED'
            }
        }).then((response) => {
            const data = response.data;
            if (!data || data.status != 0) {
                console.error('failed to fetch twin class fields', data)
                let message = "Failed to load twin class fields";
                if (data?.msg) message += `: ${data.msg}`;
                toast.error(message);
                return;
            }
            setStatuses(data.twinClass?.statusList ?? []);
            setStatusesMap(data.twinClass?.statusMap ?? {});
        }).catch((e) => {
            console.error('exception while fetching twin class fields', e)
            toast.error("Failed to fetch twin class fields")
        }).finally(() => setLoading(false))
    }

    function renderLogo(url: string | undefined) {
        if (!url) {
            return null;
        }
        return <Image src={url} alt={url} width={32} height={32}/>;
    }

    function createStatus() {
        setEditedStatus(null);
        setCreateEditStatusDialogOpen(true);
    }

    function editStatus(status: TwinClassStatus) {
        setEditedStatus(status);
        setCreateEditStatusDialogOpen(true);
    }

    return <>
        <h2>
            Statuses
            <Button onClick={createStatus} className="ml-4">
                Create status
            </Button>
        </h2>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.values(statusesMap).map((status) => {
                    return <TableRow key={status.id}>
                        <TableCell>{status.id}</TableCell>
                        <TableCell>{status.key}</TableCell>
                        <TableCell>{status.name}</TableCell>
                        <TableCell>{status.description}</TableCell>
                        <TableCell className="inline-flex items-center gap-1">
                            <div className="w-4 h-4 rounded" style={{backgroundColor: status.color}}>
                            </div>
                            {status.color}
                        </TableCell>
                        <TableCell>
                            {renderLogo(status.logo)}
                        </TableCell>
                        <TableCell>
                            <Button variant="ghost" size="iconTiny" onClick={() => editStatus(status)}><Edit2Icon/></Button>
                        </TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>

        <CreateEditTwinStatusDialog open={createEditStatusDialogOpen} twinClassId={twinClass.id!} status={editedStatus}
                                    onOpenChange={setCreateEditStatusDialogOpen}
                                    onSuccess={fetchData}/>
    </>
}