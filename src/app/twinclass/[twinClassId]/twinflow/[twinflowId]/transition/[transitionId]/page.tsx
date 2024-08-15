'use client'

import {useContext, useEffect, useState} from "react";
import {ApiContext} from "@/lib/api/api";
import {TwinFlow, TwinFlowTransition} from "@/lib/api/api-types";
import {toast} from "sonner";
import {Section, SideNavLayout} from "@/components/layout/side-nav-layout";
import {TwinflowGeneral} from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-general";
import {TwinflowTransitions} from "@/app/twinclass/[twinClassId]/twinflow/[twinflowId]/twinflow-transitions";
import {Table, TableBody} from "@/components/base/table";
import {TwinClassContext} from "@/app/twinclass/[twinClassId]/twin-class-context";
import {LoadingOverlay} from "@/components/base/loading";

interface TransitionPageProps {
    params: {
        twinClassId: string,
        twinflowId: string,
        transitionId: string
    }
}

export default function TransitionPage({params: {twinClassId, twinflowId, transitionId}}: TransitionPageProps) {
    const api = useContext(ApiContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [transition, setTransition] = useState<TwinFlowTransition | undefined>(undefined);
    const {findStatusById} = useContext(TwinClassContext);

    useEffect(() => {
        fetchTransitionData()
    }, [])


    function fetchTransitionData() {
        setLoading(true);
        api.twinflow.getTransitionById({
            transitionId
        }).then((response) => {
            const data = response.data;
            if (!data || data.status != 0) {
                console.error('failed to fetch twin class', data)
                let message = "Failed to load twin class";
                if (data?.msg) message += `: ${data.msg}`;
                toast.error(message);
                return;
            }
            setTransition(data.transition);
        }).catch((e) => {
            console.error('exception while fetching twin class', e)
            toast.error("Failed to fetch twin class")
        }).finally(() => setLoading(false))
    }

    const sections: Section[] = transition ? [
        {
            key: 'general',
            label: 'General',
            content: <TransitionGeneral transition={transition} onChange={fetchTransitionData}/>
        },
        // {
        //     key: 'transitions',
        //     label: 'Transitions',
        //     content: <TwinflowTransitions twinflow={twinflow} onChange={fetchTwinflowData}/>
        // }
    ] : []

    return <div>
        {loading && <LoadingOverlay/>}
        {transition && <SideNavLayout sections={sections} returnOptions={{
            path: `/twinclass/${twinClassId}/twinflow/${twinflowId}`,
            label: 'Back to class'
        }}>
            <h1 className="text-xl font-bold">Transition {transition.name ?? transition.id}</h1>
        </SideNavLayout>}
    </div>
}

function TransitionGeneral({transition, onChange}:{transition: TwinFlowTransition, onChange: () => any}) {
    return <>
        <Table className="mt-8">
            <TableBody>

            </TableBody>
        </Table>
    </>
}