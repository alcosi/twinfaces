import React, { createContext, useEffect, useState } from "react";

import {
  PermissionSchema,
  useFetchPermissionSchemaById,
} from "@/entities/permission-schema";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";

interface PermissionSchemaContextProps {
  schemaId: string;
  schema: PermissionSchema;
  refresh: () => Promise<void>;
}

export const PermissionSchemaContext =
  createContext<PermissionSchemaContextProps>(
    {} as PermissionSchemaContextProps
  );

export function PermissionSchemaContextProvider({
  schemaId,
  children,
}: {
  schemaId: string;
  children: React.ReactNode;
}) {
  const [schema, setSchema] = useState<PermissionSchema | undefined>(undefined);
  const { fetchPermissionSchemaById, loading } = useFetchPermissionSchemaById();

  useEffect(() => {
    refresh();
  }, [schemaId]);

  async function refresh() {
    const response = await fetchPermissionSchemaById({
      schemaId,
      query: {
        lazyRelation: false,
        showPermissionSchemaMode: "DETAILED",
        showPermissionSchema2UserMode: "DETAILED",
        showPermissionSchema2BusinessAccountMode: "DETAILED",
      },
    });
    setSchema(response);
  }

  if (isUndefined(schema) || loading) return <LoadingOverlay />;

  return (
    <PermissionSchemaContext.Provider
      value={{
        schemaId,
        schema,
        refresh,
      }}
    >
      {children}
    </PermissionSchemaContext.Provider>
  );
}
