import {createContext, useContext, useEffect, useState} from "react";
import {TwinClass} from "@/lib/api/api-types";
import {ApiContext} from "@/lib/api/api";
import {toast} from "sonner";
import {LoadingOverlay} from "@/components/base/loading";


interface TwinClassContextProps {
    twinClassId: string,
    twinClass: TwinClass | undefined,
    loading: boolean,
    fetchClassData: () => void
}

export const TwinClassContext = createContext<TwinClassContextProps>({} as TwinClassContextProps);

export function TwinClassContextProvider({twinClassId, children}:{twinClassId: string, children: React.ReactNode}) {
    const api = useContext(ApiContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [twinClass, setTwinClass] = useState<TwinClass | undefined>(undefined);

    useEffect(() => {
        fetchClassData()
    }, [])

    function fetchClassData() {
        setLoading(true);
        api.twinClass.getById({
            id: twinClassId,
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

    return <TwinClassContext.Provider value={{
        twinClassId,
        twinClass: twinClass,
        loading,
        fetchClassData
    }}>
        {loading && <LoadingOverlay/>}
        {!loading && children}
    </TwinClassContext.Provider>
}