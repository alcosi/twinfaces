import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Projection_DETAILED,
  useFetchProjectionById,
} from "@/entities/projection";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type ProjectionContextProps = {
  projectionId: string;
  projection: Projection_DETAILED;
  refresh: () => Promise<void>;
};

export const ProjectionContext = createContext<ProjectionContextProps>(
  {} as ProjectionContextProps
);

export function ProjectionContextProvider({
  projectionId,
  children,
}: {
  projectionId: string;
  children: ReactNode;
}) {
  const [projection, setProjection] = useState<Projection_DETAILED | undefined>(
    undefined
  );

  const { fetchProjectionById, isLoading } = useFetchProjectionById();

  const refresh = useCallback(async () => {
    try {
      const result = await fetchProjectionById(projectionId);

      if (result) setProjection(result);
    } catch (err) {
      console.error("Failed to fetch projection:", err);
    }
  }, [projectionId, fetchProjectionById]);

  useEffect(() => {
    refresh();
  }, [projectionId, refresh]);

  if (isUndefined(projection) || isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ProjectionContext.Provider value={{ projectionId, projection, refresh }}>
      {children}
    </ProjectionContext.Provider>
  );
}
