import { LoadingOverlay } from "@/shared/ui/loading";
import { TwinClass, useFetchTwinClassById } from "@/entities/twinClass";
import { TwinClassLink } from "@/entities/twinClassLink";
import { TwinStatus } from "@/entities/twinStatus";
import { RelatedObjects } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { toast } from "sonner";

interface TwinClassContextProps {
  twinClassId: string;
  twinClass: TwinClass;
  relatedObjects?: RelatedObjects;
  loading: boolean;
  fetchClassData: () => void;
  statuses: TwinStatus[];
  getStatusesBySearch: (search: string) => Promise<TwinStatus[]>;
  findStatusById: (id: string) => Promise<TwinStatus | undefined>;
  linkId?: string;
  link?: TwinClassLink;
  isForwardLink?: boolean;
}

export type TwinClassLayoutProps = PropsWithChildren<{
  params: Pick<TwinClassContextProps, "twinClassId" | "linkId">;
}>;

export const TwinClassContext = createContext<TwinClassContextProps>(
  {} as TwinClassContextProps
);

export function TwinClassContextProvider({
  params: { twinClassId, linkId },
  children,
}: TwinClassLayoutProps) {
  const { fetchTwinClassById } = useFetchTwinClassById();
  const [loading, setLoading] = useState<boolean>(false);
  const [twinClass, setTwinClass] = useState<TwinClass | undefined>(undefined);
  const [relatedObjects, setRelatedObjects] = useState<
    RelatedObjects | undefined
  >(undefined);

  // `Status` related logic
  // TODO: Consider extracting `statuses`, `getStatusesBySearch`, and `findStatusById`
  // into a separate hook or component for better maintainability.
  const [statuses, setStatuses] = useState<TwinStatus[]>([]);

  // `Link` related logic
  // TODO: Consider extracting `linkId`, `link` and `isForwardLink`
  // into a separate hook or component for better maintainability.
  const [link, setLink] = useState<TwinClassLink | undefined>();
  const [isForwardLink, setIsForwardLink] = useState<boolean>();

  useEffect(() => {
    fetchClassData();
  }, [twinClassId, linkId]);

  async function fetchClassData() {
    setLoading(true);
    try {
      const { data } = await fetchTwinClassById({
        id: twinClassId,
        query: {
          showTwinClassMode: "MANAGED",
          showTwin2TwinClassMode: "MANAGED",
          showTwinClassHead2TwinClassMode: "MANAGED",
          showTwinClassExtends2TwinClassMode: "DETAILED",
          showTwinClass2StatusMode: "DETAILED",
          showTwinClass2LinkMode: "DETAILED",
          showLinkDst2TwinClassMode: "DETAILED",
          showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
          showTwinClassMarker2DataListOptionMode: "DETAILED",
          showTwinClassTag2DataListOptionMode: "DETAILED",
          lazyRelation: false,
        },
      });

      setTwinClass(data?.twinClass);
      setRelatedObjects(data?.relatedObjects);
      setStatuses(
        data?.twinClass?.statusMap
          ? Object.values(data.twinClass?.statusMap)
          : []
      );

      if (linkId) {
        const forwardLink = data?.twinClass?.forwardLinkMap?.[linkId];
        const backwardLink = data?.twinClass?.backwardLinkMap?.[linkId];
        setLink(forwardLink || backwardLink);
        setIsForwardLink(!!forwardLink);
      }
    } catch (e) {
      console.error("exception while fetching twin class", e);
      toast.error("Failed to fetch twin class");
    } finally {
      setLoading(false);
    }
  }

  async function getStatusesBySearch(search: string) {
    return statuses.filter(
      (status) =>
        (status.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (status.key ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }

  async function findStatusById(id: string) {
    return statuses.find((x) => x.id === id);
  }

  if (isUndefined(twinClass)) return <>{loading && <LoadingOverlay />}</>;

  return (
    <TwinClassContext.Provider
      value={{
        twinClassId,
        twinClass,
        relatedObjects,
        loading,
        fetchClassData,
        statuses,
        getStatusesBySearch,
        findStatusById,
        linkId,
        link,
        isForwardLink,
      }}
    >
      {loading && <LoadingOverlay />}
      {!loading && children}
    </TwinClassContext.Provider>
  );
}
