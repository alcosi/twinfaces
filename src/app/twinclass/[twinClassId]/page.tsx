'use client'

import {TwinClassStatuses} from "@/app/twinclass/[twinClassId]/twin-class-statuses";
import {TwinClassGeneral} from "@/app/twinclass/[twinClassId]/twin-class-general";
import {TwinClassFields} from "@/app/twinclass/[twinClassId]/twin-class-fields";
import {Section, SideNavLayout} from "@/components/layout/side-nav-layout";
import {TwinClassTwinflows} from "@/app/twinclass/[twinClassId]/twin-class-twinflows";

export default function TwinClassPage() {

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

    return <SideNavLayout sections={sections}/>
}




