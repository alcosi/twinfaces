import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import { Link, useLinkFetchById } from "@/entities/link";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type LinkContextProps = {
  linkId: string;
  link: Link;
  refresh: () => Promise<void>;
};

export const LinkContext = createContext<LinkContextProps>(
  {} as LinkContextProps
);

export function LinkContextProvider({
  linkId,
  children,
}: {
  linkId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [linkId]);

  const [link, setLink] = useState<Link | undefined>(undefined);
  const { fetchLinkById, loading } = useLinkFetchById();
  const api = useContext(PrivateApiContext);

  async function fetchTwinClass(
    id: string
  ): Promise<TwinClass_DETAILED | undefined> {
    try {
      const { data, error } = await api.twinClass.getById({
        id,
        query: { lazyRelation: false, showTwinClassMode: "DETAILED" },
      });

      if (error || !data?.twinClass) return undefined;

      return data.twinClass as TwinClass_DETAILED;
    } catch {
      return undefined;
    }
  }

  async function refresh() {
    try {
      const response = await fetchLinkById({
        linkId,
        query: {
          lazyRelation: false,
          showLinkMode: "MANAGED",
          showLinkSrc2TwinClassMode: "DETAILED",
          showLinkDst2TwinClassMode: "DETAILED",
          showLink2UserMode: "DETAILED",
        },
      });

      if (!response) return;

      // The single-link endpoint doesn't always expand src/dst twin classes
      // into relatedObjects, so resolve any missing one so the page renders it
      // as a resource link instead of a raw id.
      const [srcTwinClass, dstTwinClass] = await Promise.all([
        response.srcTwinClassId && !response.srcTwinClass
          ? fetchTwinClass(response.srcTwinClassId)
          : response.srcTwinClass,
        response.dstTwinClassId && !response.dstTwinClass
          ? fetchTwinClass(response.dstTwinClassId)
          : response.dstTwinClass,
      ]);

      setLink({ ...response, srcTwinClass, dstTwinClass });
    } catch {
      toast.error("Failed to fetch link:");
    }
  }

  if (isUndefined(link) || loading) return <LoadingOverlay />;

  return (
    <LinkContext.Provider value={{ linkId, link, refresh }}>
      {children}
    </LinkContext.Provider>
  );
}
