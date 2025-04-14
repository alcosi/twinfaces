import React, { createContext, useEffect, useState } from "react";

import { getAuthTokenFromCookies } from "@/entities/face";
import { useTwinFetchByIdV2 } from "@/entities/twin";
import { useTwinClassSearchV1 } from "@/entities/twin-class";
import { Twin_DETAILED } from "@/entities/twin/server";
import { useFetchUserPermissionById } from "@/entities/user";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

interface TwinContextProps {
  twinId: string;
  twin: Twin_DETAILED;
  refresh: () => void;
  isPermissionDomainManaged: boolean | null;
}

export const TwinContext = createContext<TwinContextProps>(
  {} as TwinContextProps
);

export function TwinContextProvider({
  twinId,
  children,
}: {
  twinId: string;
  children: React.ReactNode;
}) {
  const [twin, setTwin] = useState<Twin_DETAILED | undefined>(undefined);
  const [isPermissionDomainManaged, setIsPermissionDomainManaged] = useState<
    boolean | null
  >(null);
  const { fetchTwinById, loading: twinLoading } = useTwinFetchByIdV2();
  const { searchTwinClasses, loading: twinClassLoading } =
    useTwinClassSearchV1();
  const { fetchPermissionUserById, loading: peermissionUserLoading } =
    useFetchUserPermissionById();

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const twin = await fetchTwinById(twinId);
      const authToken = await getAuthTokenFromCookies();

      if (twin) {
        const { data } = await searchTwinClasses({
          filters: {
            headHierarchyChildsForTwinClassSearch: {
              idList: [twin?.twinClassId],
              depth: 1,
            },
          },
        });

        twin.subordinates = data;

        if (authToken) {
          const permissionUser = await fetchPermissionUserById({
            userId: authToken,
            query: {
              lazyRelation: false,
              showPermissionMode: "DETAILED",
            },
          });

          const isDomainManaged = permissionUser.some(
            (el) => el.key === "DOMAIN_MANAGE"
          );

          setIsPermissionDomainManaged(isDomainManaged);
        }
      }

      setTwin(twin);
    } catch (error) {
      console.error("Failed to fetch twin:", error);
    }
  }

  if (isUndefined(twin)) return <LoadingOverlay />;

  return (
    <TwinContext.Provider
      value={{
        twinId,
        twin,
        refresh,
        isPermissionDomainManaged,
      }}
    >
      {twinLoading || twinClassLoading || peermissionUserLoading ? (
        <LoadingOverlay />
      ) : (
        children
      )}
    </TwinContext.Provider>
  );
}
