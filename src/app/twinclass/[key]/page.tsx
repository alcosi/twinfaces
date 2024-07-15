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
import {TwinClassStatuses} from "@/app/twinclass/[key]/twin-class-statuses";
import {TwinClassGeneral} from "@/app/twinclass/[key]/twin-class-general";
import {TwinClassFields} from "@/app/twinclass/[key]/twin-class-fields";

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
                showTwinClassMode: 'DETAILED',
                showTwin2TwinClassMode: 'DETAILED',
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

            <Separator className="h-auto" orientation='vertical'/>

            <div className="flex-[4] pl-4">
                {selectedSection?.key === 'general' && twinClass && <TwinClassGeneral twinClass={twinClass}/>}
                {selectedSection?.key === 'fields' && twinClass && <TwinClassFields twinClass={twinClass}/>}
                {selectedSection?.key === 'statuses' && twinClass && <TwinClassStatuses twinClass={twinClass}/>}
            </div>
        </div>
    </div>
}




