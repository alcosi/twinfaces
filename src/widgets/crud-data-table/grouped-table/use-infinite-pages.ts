import { useCallback, useEffect, useRef, useState } from "react";

export type InfinitePage<T> = { items: T[]; total: number };

/**
 * Appends page after page of a list whose total is known from the first one.
 * The first page is requested on mount; `loadMore` asks for the next.
 */
export function useInfinitePages<T>(
  loadPage: (offset: number, limit: number) => Promise<InfinitePage<T>>,
  pageSize: number
) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // Refs rather than state: a request decides its offset, and whether it may
  // start at all, from values that must not wait for a re-render.
  const loadedRef = useRef(0);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const loadPageRef = useRef(loadPage);
  loadPageRef.current = loadPage;

  const loadMore = useCallback(() => {
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setLoading(true);
    setFailed(false);

    loadPageRef
      .current(loadedRef.current, pageSize)
      .then((page) => {
        if (!mountedRef.current) return;

        loadedRef.current += page.items.length;
        setItems((prev) => [...prev, ...page.items]);
        // A short page means the end, whatever the reported total says —
        // otherwise a total that is never reached would keep asking for more.
        setTotal(page.items.length < pageSize ? loadedRef.current : page.total);
      })
      .catch(() => {
        if (mountedRef.current) setFailed(true);
      })
      .finally(() => {
        inFlightRef.current = false;
        if (mountedRef.current) setLoading(false);
      });
  }, [pageSize]);

  useEffect(() => {
    mountedRef.current = true;
    loadMore();
    return () => {
      mountedRef.current = false;
    };
  }, [loadMore]);

  const hasMore = total !== null && items.length < total;

  return { items, total, loading, failed, hasMore, loadMore };
}
