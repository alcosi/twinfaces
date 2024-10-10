'use client'

import {Section, SideNavLayout} from "@/components/layout/side-nav-layout";
import {TwinGeneral} from "@/app/twin/[twinId]/twin-general";

export default function TwinPage() {

    const sections: Section[] = [
        {
            key: 'general',
            label: 'General',
            content: <TwinGeneral/>
        },
    ]

    return <SideNavLayout sections={sections}/>
}




