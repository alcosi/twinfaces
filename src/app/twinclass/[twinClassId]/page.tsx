'use client'

import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {TwinClass} from "@/lib/api/api-types";
import {toast} from "sonner";
import {LoadingOverlay} from "@/components/base/loading";
import {useParams} from "next/navigation";
import {TwinClassStatuses} from "@/app/twinclass/[twinClassId]/twin-class-statuses";
import {TwinClassGeneral} from "@/app/twinclass/[twinClassId]/twin-class-general";
import {TwinClassFields} from "@/app/twinclass/[twinClassId]/twin-class-fields";
import {Section, SideNavLayout} from "@/components/layout/side-nav-layout";
import {TwinClassTwinflows} from "@/app/twinclass/[twinClassId]/twin-class-twinflows";
import {TwinClassContextProvider} from "@/app/twinclass/[twinClassId]/twin-class-context";

interface TwinClassPageProps {
    params: {
        twinClassId: string
    }
}

export default function TwinClassPage({params: {twinClassId}}: TwinClassPageProps) {
    // const api = useContext(ApiContext);
    // const [loading, setLoading] = useState<boolean>(false);
    // const [twinClass, setTwinClass] = useState<TwinClass | undefined>(undefined);

    // useEffect(() => {
    //     fetchClassData()
    // }, [])

    const sections: Section[] = [
        {
            key: 'general',
            label: 'General',
            content: <TwinClassGeneral/>
        },
        {
            key: 'fields',
            label: 'Fields',
            content: <TwinClassFields/>
        },
        {
            key: 'statuses',
            label: 'Statuses',
            content: <TwinClassStatuses/>
        },
        {
            key: 'twinflows',
            label: 'Twinflows',
            content: <TwinClassTwinflows/>
        }
    ]

    // function fetchClassData() {
    //     setLoading(true);
    //     api.twinClass.getById({
    //         id: twinClassId,
    //         query: {
    //             showTwinClassMode: 'MANAGED',
    //             showTwin2TwinClassMode: 'MANAGED',
    //             showTwinClassHead2TwinClassMode: 'MANAGED',
    //
    //         }
    //     }).then((response) => {
    //         const data = response.data;
    //         if (!data || data.status != 0) {
    //             console.error('failed to fetch twin class', data)
    //             let message = "Failed to load twin class";
    //             if (data?.msg) message += `: ${data.msg}`;
    //             toast.error(message);
    //             return;
    //         }
    //         setTwinClass(data.twinClass);
    //     }).catch((e) => {
    //         console.error('exception while fetching twin class', e)
    //         toast.error("Failed to fetch twin class")
    //     }).finally(() => setLoading(false))
    // }

    return <div>
        <TwinClassContextProvider twinClassId={twinClassId}>
            {/*{twinClass && <SideNavLayout sections={sections}/>}*/}
            <SideNavLayout sections={sections}/>
        </TwinClassContextProvider>
    </div>
}




