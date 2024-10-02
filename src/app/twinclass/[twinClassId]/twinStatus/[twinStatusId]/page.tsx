'use client'

import {Section, SideNavLayout} from "@/components/layout/side-nav-layout";
import {LoadingOverlay} from "@/components/base/loading";
import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {toast} from "sonner";
import {TwinClassStatus} from "@/lib/api/api-types";
import {TwinClassContext} from "@/app/twinclass/[twinClassId]/twin-class-context";
import {TwinStatusGeneral} from "@/app/twinclass/[twinClassId]/twinStatus/[twinStatusId]/twinStatus-general";

interface TwinStatusPageProps {
    params: {
        twinStatusId: string
    }
}

export default function TwinClassPage({params: {twinStatusId}}: TwinStatusPageProps) {
    const api = useContext(ApiContext);
    const {twinClass} = useContext(TwinClassContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [twinStatus, setTwinStatus] = useState<TwinClassStatus | undefined>(undefined);

    useEffect(() => {
        fetchTwinClassData()
    }, [twinStatusId])

    function fetchTwinClassData() {
        if (twinStatusId) {
            setLoading(true);

            api.twinClass.getStatusById({
                twinStatusId: twinStatusId,
            }).then((response) => {
                const data = response.data;
                if (!data || data.status != 0) {
                    console.error('failed to fetch twin class', data)
                    let message = "Failed to load twin class";
                    if (data?.msg) message += `: ${data.msg}`;
                    toast.error(message);
                    return;
                }
                setTwinStatus(data.twinStatus);
            }).catch((e) => {
                console.error('exception while fetching twin class', e)
                toast.error("Failed to fetch twin class")
            }).finally(() => setLoading(false))
        }
    }

    const sections: Section[] = twinStatus ? [
        {
            key: 'general',
            label: 'General',
            content: <TwinStatusGeneral onChange={fetchTwinClassData} status={twinStatus}/>
        },
    ] : []

    return <div>
        {loading && <LoadingOverlay/>}
        {twinStatus && <SideNavLayout sections={sections} returnOptions={{
            path: `/twinclass/${twinClass?.id}#statuses`,
            label: 'Back to class'
        }}>
            <h1 className="text-xl font-bold">{twinStatus.name}</h1>
        </SideNavLayout>}
    </div>
}