"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Link_MANAGED, hydrateLinkFromMap } from "@/entities/link";
import { TwinClass_DETAILED, useTwinClassSearch } from "@/entities/twin-class";
import { PrivateApiContext } from "@/shared/api";

import { ClassGraphData, ClassGraphLink } from "./types";

function uniqueById(list: TwinClass_DETAILED[]): TwinClass_DETAILED[] {
  const seen = new Set<string>();

  return list.filter((item) => {
    if (!item?.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

type LinkWithClass = Link_MANAGED & { dstTwinClass: TwinClass_DETAILED };

/** A link whose other end could not be resolved has nowhere to be drawn. */
function hasLinkedClass(link: Link_MANAGED): link is LinkWithClass {
  return Boolean(link.dstTwinClass?.id);
}

/**
 * Loads the class, its heads, children and links, and then every one of those
 * classes in full — the cards list their fields and statuses, which only the
 * single-class endpoint returns.
 *
 * `reload` keeps the data already on screen until the new one arrives, so a
 * refresh after creating a link does not blank the canvas.
 */
export function useClassGraphData(
  twinClassId: string,
  twinClass: TwinClass_DETAILED | undefined
) {
  const api = useContext(PrivateApiContext);
  const { searchByFilters } = useTwinClassSearch();
  const [data, setData] = useState<ClassGraphData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const requestRef = useRef(0);

  const load = useCallback(async () => {
    if (!twinClassId) return;

    const request = ++requestRef.current;
    const isStale = () => request !== requestRef.current;

    setLoading(true);

    try {
      const [headsResponse, childsResponse, linksResponse] = await Promise.all([
        searchByFilters({
          pagination: { pageIndex: 0, pageSize: 100 },
          filters: {
            headHierarchyParentsForTwinClassSearch: {
              idList: [twinClassId],
              depth: 1,
            },
          },
        }),
        searchByFilters({
          pagination: { pageIndex: 0, pageSize: 200 },
          filters: {
            headHierarchyChildsForTwinClassSearch: {
              idList: [twinClassId],
              depth: 1,
            },
          },
        }),
        api.twinClass.getLinks({ twinClassId }),
      ]);

      if (isStale()) return;

      const linksData = linksResponse.data;
      const forwardLinks = Object.values(linksData?.forwardLinkMap ?? {})
        .map((link) => hydrateLinkFromMap(link, linksData?.relatedObjects))
        .filter(hasLinkedClass);
      const backwardLinks = Object.values(linksData?.backwardLinkMap ?? {})
        .map((link) => hydrateLinkFromMap(link, linksData?.relatedObjects))
        .filter(hasLinkedClass);

      const neededIds = new Set<string>(
        [
          twinClass,
          ...headsResponse.data,
          ...childsResponse.data,
          ...forwardLinks.map((link) => link.dstTwinClass),
          ...backwardLinks.map((link) => link.dstTwinClass),
        ]
          .map((item) => item?.id)
          .filter((id): id is string => Boolean(id))
      );
      neededIds.add(twinClassId);

      const detailsEntries = await Promise.all(
        Array.from(neededIds).map(async (id) => {
          const { data, error } = await api.twinClass.getById({
            id,
            query: {
              lazyRelation: false,
              showTwinClassMode: "DETAILED",
              showTwinClass2TwinClassFieldMode: "DETAILED",
              showTwinClass2StatusMode: "DETAILED",
              showTwinClassFieldCollectionMode: "SHOW",
            },
          });

          if (error || !data?.twinClass) return undefined;

          const details = {
            ...data.twinClass,
            fields: (data.twinClass.fieldIds ?? [])
              .map(
                (fieldId) => data.relatedObjects?.twinClassFieldMap?.[fieldId]
              )
              .filter(Boolean),
            statuses: (data.twinClass.statusIds ?? [])
              .map((statusId) => data.relatedObjects?.statusMap?.[statusId])
              .filter(Boolean),
          } as TwinClass_DETAILED;

          return [id, details] as const;
        })
      );

      if (isStale()) return;

      const detailsMap = new Map(
        detailsEntries.filter(
          (entry): entry is readonly [string, TwinClass_DETAILED] =>
            Boolean(entry)
        )
      );

      const withDetails = (item: TwinClass_DETAILED) =>
        detailsMap.get(item.id) ?? item;

      const toGraphLinks = (links: LinkWithClass[]): ClassGraphLink[] =>
        links.map((link) => ({
          link,
          twinClass: withDetails(link.dstTwinClass),
        }));

      const center = detailsMap.get(twinClassId) ?? twinClass;

      setData(
        center
          ? {
              center,
              heads: uniqueById(headsResponse.data)
                .filter((item) => item.id !== twinClassId)
                .map(withDetails),
              children: uniqueById(childsResponse.data)
                .filter((item) => item.id !== twinClassId)
                .map(withDetails),
              forward: toGraphLinks(forwardLinks),
              backward: toGraphLinks(backwardLinks),
            }
          : undefined
      );
    } catch (error) {
      console.error(error);
      if (!isStale()) toast.error("Failed to load twin class graph");
    } finally {
      if (!isStale()) setLoading(false);
    }
  }, [api.twinClass, searchByFilters, twinClass, twinClassId]);

  useEffect(() => {
    load();

    // Anything still in flight belongs to the previous class.
    return () => {
      requestRef.current++;
    };
  }, [load]);

  return { data, loading, reload: load };
}
