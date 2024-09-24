'use client'

import {TwinClassStatuses} from "@/app/twinclass/[twinClassId]/twin-class-statuses";
import {TwinClassGeneral} from "@/app/twinclass/[twinClassId]/twin-class-general";
import {TwinClassFields} from "@/app/twinclass/[twinClassId]/twin-class-fields";
import {Section, SideNavLayout} from "@/components/layout/side-nav-layout";
import {TwinClassTwinflows} from "@/app/twinclass/[twinClassId]/twin-class-twinflows";
import {TwinClassLinks} from "@/app/twinclass/[twinClassId]/twin-class-links";

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
        },
        {
            key: 'links',
            label: 'Links',
            content: <TwinClassLinks/>
        }
    ]

    return <SideNavLayout sections={sections}/>
}




