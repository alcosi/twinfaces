import { useCallback, useEffect, useRef, useState } from "react";

export type InfinitePage<T> = { items: T[]; total: number };

/**
 * Appends page after page of a list whose total is known from the first one.
 * The first page is requested on mount; `loadMore` asks for the next.
 *
 * Items already loaded are dropped from later pages by `getKey`: offset pages
 * of a search sorted by a non-unique field (statuses sort by `key` by default)
 * may overlap, and a row shown twice would break React's keys.
 */
export function useInfinitePages<T>(
  loadPage: (offset: number, limit: number) => Promise<InfinitePage<T>>,
  pageSize: number,
  getKey: (item: T) => string
) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(0);

  // Refs rather than state: a request decides its offset, and whether it may
  // start at all, from values that must not wait for a re-render.
  const loadedRef = useRef(0);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const seenKeysRef = useRef(new Set<string>());
  const loadPageRef = useRef(loadPage);
  loadPageRef.current = loadPage;
  const getKeyRef = useRef(getKey);
  getKeyRef.current = getKey;

  const loadMore = useCallback(() => {
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setLoading(true);
    setFailed(false);

    loadPageRef
      .current(loadedRef.current, pageSize)
      .then((page) => {
        if (!mountedRef.current) return;

        // The offset counts what the server returned, duplicates included.
        loadedRef.current += page.items.length;
        const fresh = page.items.filter((item) => {
          const key = getKeyRef.current(item);
          if (seenKeysRef.current.has(key)) return false;
          seenKeysRef.current.add(key);
          return true;
        });
        setItems((prev) => [...prev, ...fresh]);
        setLoaded(loadedRef.current);
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

  const hasMore = total !== null && loaded < total;

  return { items, total, loading, failed, hasMore, loadMore };
}
