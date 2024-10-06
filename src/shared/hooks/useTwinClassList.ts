import { useEffect, useState } from 'react';
import { ApiContextProps } from "@/lib/api/api";

interface TwinClassListHook<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

// NOTE: This is temp solution
// TODO: replace with better solution later on
export const useTwinClassList = <T>(api: ApiContextProps): TwinClassListHook<T> => {
    const [data, setData] = useState<T | null>(useTwinClassList.cache || null);
    const [loading, setLoading] = useState<boolean>(!useTwinClassList.cache);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (useTwinClassList.cache) {
            return;
        }

        const fetchTwinClassData = async () => {
            try {
                const res = await api.twinClass.search({
                    pagination: {
                        pageIndex: 0,
                        pageSize: 9999,
                    },
                    filters: {},
                });
                useTwinClassList.cache = res.data;
                setData(res.data as T);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchTwinClassData();
    }, [api]);

    return { data, loading, error };
};

// Static cache for the hook
useTwinClassList.cache = null as any;
