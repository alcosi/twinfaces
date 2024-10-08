import { useEffect, useState } from 'react';
import {ApiContextProps} from "@/lib/api/api";


interface TwinListHook<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

// NOTE: This is temp solution
// TODO: replace with better solution later on
export const useTwinList = <T>(api: ApiContextProps): TwinListHook<T> => {
    const [data, setData] = useState<T | null>(useTwinList.cache || null);
    const [loading, setLoading] = useState<boolean>(!useTwinList.cache);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (useTwinList.cache) {
            return;
        }

        const fetchTwinData = async () => {
            try {
                const res = await api.twin.search({
                    pagination: {
                        pageIndex: 0,
                        pageSize: 9999,
                    },
                    filters: {},
                });
                useTwinList.cache = res.data;
                setData(res.data as T);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchTwinData();
    }, [api]);

    return { data, loading, error };
};

// Static cache for the hook
useTwinList.cache = null as any;