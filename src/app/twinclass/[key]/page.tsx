'use client'

import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {TwinClass, TwinClassField, TwinClassStatus} from "@/lib/api/api-types";
import {toast} from "sonner";
import {LoadingOverlay} from "@/components/ui/loading";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {useParams, usePathname} from "next/navigation";
import {Button} from "@/components/ui/button";
import CreateEditTwinStatusDialog from "@/app/twinclass/[key]/twin-status-dialog";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";
import {Edit2Icon, EditIcon} from "lucide-react";

interface TwinClassPageProps {
    params: {
        key: string
    }
}

interface Section {
    key: string;
    label: string;
}

const sections: Section[] = [
    {
        key: 'general',
        label: 'General',
    },
    {
        key: 'fields',
        label: 'Fields',
    },
    {
        key: 'statuses',
        label: 'Statuses',
    },
    // {
    //     key: 'transitions',
    //     label: 'Transitions',
    // },
]

export default function TwinClassPage({params: {key}}: TwinClassPageProps) {
    const api = useContext(ApiContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [twinClass, setTwinClass] = useState<TwinClass | undefined>(undefined);
    const [selectedSection, setSelectedSection] = useState<Section>();

    const params = useParams();

    useEffect(() => {
        // check if pathname ends with any #section and set section accordingly
        const hash = window.location.hash.replace('#', '');
        console.log('hash', hash)
        const section = sections.find((section) => section.key === hash);
        console.log('section', section)
        setSelectedSection(section ?? sections[0]);
    }, [params])

    useEffect(() => {
        setLoading(true);
        api.twinClass.getByKey({
            key: key,
            query: {
                showClassMode: 'DETAILED'
            }
        }).then((response) => {
            const data = response.data;
            if (!data || data.status != 0) {
                console.error('failed to fetch twin class', data)
                let message = "Failed to load twin class";
                if (data?.msg) message += `: ${data.msg}`;
                toast.error(message);
                return;
            }
            setTwinClass(data.twinClass);
        }).catch((e) => {
            console.error('exception while fetching twin class', e)
            toast.error("Failed to fetch twin class")
        }).finally(() => setLoading(false))
    }, [])

    return <div>
        {loading && <LoadingOverlay/>}

        {/*<div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">*/}
        <div className="mx-auto w-full max-w-6xl flex md:flex-row flex-col gap-4">
            <nav
                className="flex-1 grid gap-4 text-sm text-muted-foreground auto-rows-max"
            >
                {sections.map((section) => {
                    const isSelected = section.key === selectedSection?.key;
                    return <Link href={`#${section.key}`} key={section.key}
                                 className={cn(isSelected && 'font-semibold', "text-primary")}>
                        {section.label}
                    </Link>;
                })}
            </nav>
            {/*<div className="grid gap-6">*/}
            {/*    {twinClass && <pre>{JSON.stringify(twinClass, null, 2)}</pre>}*/}
            {/*</div>*/}

            <Separator className="h-auto" orientation='vertical'/>

            <div className="flex-[4] pl-4">
                {selectedSection?.key === 'general' && twinClass && <TwinClassGeneral twinClass={twinClass}/>}
                {selectedSection?.key === 'fields' && twinClass && <TwinClassFields twinClass={twinClass}/>}
                {selectedSection?.key === 'statuses' && twinClass && <TwinClassStatuses twinClass={twinClass}/>}
            </div>
        </div>
    </div>
}

function TwinClassGeneral({twinClass}: { twinClass: TwinClass }) {
    return <>
        <h2>General</h2>
        <pre>{JSON.stringify(twinClass, null, 2)}</pre>
    </>
}

function TwinClassFields({twinClass}: { twinClass: TwinClass }) {
    const api = useContext(ApiContext);

    const [fields, setFields] = useState<TwinClassField[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!twinClass.id) {
            toast.error("Twin class ID is missing");
            return;
        }

        setLoading(true);
        api.twinClass.getFields({id: twinClass.id}).then((response) => {
            const data = response.data;
            if (!data || data.status != 0) {
                console.error('failed to fetch twin class fields', data)
                let message = "Failed to load twin class fields";
                if (data?.msg) message += `: ${data.msg}`;
                toast.error(message);
                return;
            }
            setFields(data.twinClassFieldList ?? []);
        }).catch((e) => {
            console.error('exception while fetching twin class fields', e)
            toast.error("Failed to fetch twin class fields")
        }).finally(() => setLoading(false))
    }, [])

    return <>
        {loading && <LoadingOverlay/>}
        <h2>Fields</h2>
        <pre>{JSON.stringify(fields, null, 2)}</pre>
    </>
}

function TwinClassStatuses({twinClass}: { twinClass: TwinClass }) {
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
                showClassStatusMode: 'SHOW',
                showStatusMode: 'DETAILED'
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

    function editStatus(status: TwinClassStatus) {
        setEditedStatus(status);
        setCreateEditStatusDialogOpen(true);
    }

    return <>
        <h2>
            Statuses
            <Button onClick={() => setCreateEditStatusDialogOpen(true)} className="ml-4">
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
                                    onSuccess={() => {
                                        setCreateEditStatusDialogOpen(false);
                                        fetchData();
                                    }}/>
    </>
}