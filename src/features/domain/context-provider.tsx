"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import { DomainView_DETAILED, useFetchDomainById } from "@/entities/domain";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type DomainContextProps = {
  domainId: string;
  domain: DomainView_DETAILED;
  refresh: () => Promise<void>;
};

export const DomainContext = createContext<DomainContextProps>(
  {} as DomainContextProps
);

export function DomainContextProvider({
  domainId,
  children,
}: {
  domainId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [domainId]);

  const [domain, setDomain] = useState<DomainView_DETAILED | undefined>(
    undefined
  );
  const { fetchDomainById, loading } = useFetchDomainById();

  async function refresh() {
    try {
      const response = await fetchDomainById({
        domainId,
        query: {
          lazyRelation: false,
          showDomainMode: "DETAILED",
          showDomain2TierMode: "DETAILED",
          showDomain2TwinClassSchemaMode: "DETAILED",
          showDomainBusinessAccountInitiator2FeaturerMode: "DETAILED",
          showDomainBusinessAccountTemplate2TwinMode: "DETAILED",
          showDomain2PermissionSchemaMode: "DETAILED",
          showDomainNavbar2FaceMode: "DETAILED",
          showDomainUserGroupManager2FeaturerMode: "DETAILED",
          showDomainUserTemplate2TwinMode: "DETAILED",
        },
      });

      if (response) {
        setDomain(response);
      }
    } catch (error) {
      console.error("Failed to fetch domain:", error);
    }
  }

  if (isUndefined(domain) || loading) return <LoadingOverlay />;

  return (
    <DomainContext.Provider value={{ domainId, domain, refresh }}>
      {children}
    </DomainContext.Provider>
  );
}
