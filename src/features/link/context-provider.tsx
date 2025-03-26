import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import { Link, useLinkFetchById } from "@/entities/link";
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

      if (response) {
        setLink(response);
      }
    } catch {
      toast.error("Failed to fetch link:");
    }
  }

  if (isUndefined(link) || loading) return <LoadingOverlay />;

  return (
    <LinkContext.Provider value={{ linkId, link, refresh }}>
      {loading ? <LoadingOverlay /> : children}
    </LinkContext.Provider>
  );
}
