import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  SpaceRole_DETAILED,
  useFetchSpaceRoleById,
} from "@/entities/space-role";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type SpaceRoleContextProps = {
  spaceRoleId: string;
  spaceRole: SpaceRole_DETAILED;
  refresh: () => Promise<void>;
};

export const SpaceRoleContext = createContext<SpaceRoleContextProps>(
  {} as SpaceRoleContextProps
);

export function SpaceRoleContextProvider({
  spaceRoleId,
  children,
}: {
  spaceRoleId: string;
  children: ReactNode;
}) {
  const { fetchSpaceRoleById, isLoading } = useFetchSpaceRoleById();
  const [spaceRole, setSpaceRole] = useState<SpaceRole_DETAILED | undefined>(
    undefined
  );

  const refresh = useCallback(async () => {
    try {
      const result = await fetchSpaceRoleById(spaceRoleId);

      if (result) setSpaceRole(result);
    } catch (error) {
      console.error("Failed to fetch space role:", error);
    }
  }, [spaceRoleId, fetchSpaceRoleById]);

  useEffect(() => {
    refresh();
  }, [spaceRoleId, refresh]);

  if (isUndefined(spaceRole) || isLoading) return <LoadingOverlay />;

  return (
    <SpaceRoleContext.Provider value={{ spaceRoleId, spaceRole, refresh }}>
      {children}
    </SpaceRoleContext.Provider>
  );
}
