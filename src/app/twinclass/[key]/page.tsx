'use client'

import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {TwinClass} from "@/lib/api/api-types";
import {toast} from "sonner";
import {LoadingOverlay} from "@/components/base/loading";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {useParams} from "next/navigation";
import {Separator} from "@/components/base/separator";
import {TwinClassStatuses} from "@/app/twinclass/[key]/twin-class-statuses";
import {TwinClassGeneral} from "@/app/twinclass/[key]/twin-class-general";
import {TwinClassFields} from "@/app/twinclass/[key]/twin-class-fields";
import {TwinClassTwinflow} from "@/app/twinclass/[key]/twin-class-twinflow";

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
    {
        key: 'twinflow',
        label: 'Twinflow',
    }
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
        const section = sections.find((section) => section.key === hash);
        setSelectedSection(section ?? sections[0]);
    }, [params])

    useEffect(() => {
        fetchClassData()
    }, [])

    function fetchClassData() {
        setLoading(true);
        api.twinClass.getByKey({
            key: key,
            query: {
                showTwinClassMode: 'MANAGED',
                showTwin2TwinClassMode: 'MANAGED',
                showTwinClassHead2TwinClassMode: 'MANAGED',

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
    }

    return <div>
        {loading && <LoadingOverlay/>}

        <div className="mx-auto w-full flex md:flex-row flex-col gap-4">
            <nav
                className="flex-1 grid gap-4 text-sm text-muted-foreground auto-rows-max md:max-w-60"
            >
                {sections.map((section) => {
                    const isSelected = section.key === selectedSection?.key;
                    return <Link href={`#${section.key}`} key={section.key}
                                 className={cn(isSelected && 'font-semibold', "text-primary text-lg")}>
                        {section.label}
                    </Link>;
                })}
            </nav>

            <Separator className="h-auto" orientation='vertical'/>

            <div className="flex-[4] pl-4 2xl:max-w-screen-xl mx-auto">
                {selectedSection?.key === 'general' && twinClass &&
                    <TwinClassGeneral twinClass={twinClass} onChange={fetchClassData}/>}
                {selectedSection?.key === 'fields' && twinClass && <TwinClassFields twinClass={twinClass}/>}
                {selectedSection?.key === 'statuses' && twinClass && <TwinClassStatuses twinClass={twinClass}/>}
                {selectedSection?.key === 'twinflow' && twinClass && <TwinClassTwinflow twinClass={twinClass}/>}
            </div>
        </div>
    </div>
}




