import { ReactNode, createContext, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  DataListOptionV3,
  useDatalistOption,
} from "@/entities/datalist-option";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type DataListOptionContextProps = {
  optionId: string;
  datalistOption: DataListOptionV3;
  refresh: () => Promise<void>;
};

export const DataListOptionContext = createContext<DataListOptionContextProps>(
  {} as DataListOptionContextProps
);

export function DataListOptionContextProvider({
  optionId,
  children,
}: {
  optionId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [optionId]);

  const [datalistOption, setDatalistOption] = useState<
    DataListOptionV3 | undefined
  >(undefined);
  const { fetchDatalistOptionById, loading } = useDatalistOption();

  async function refresh() {
    try {
      const response = await fetchDatalistOptionById(optionId);

      if (response) {
        setDatalistOption(response);
      }
    } catch {
      toast.error("Failed to fetch datalist option:");
    }
  }

  if (isUndefined(datalistOption) || loading) return <LoadingOverlay />;

  return (
    <DataListOptionContext.Provider
      value={{ optionId, datalistOption, refresh }}
    >
      {loading ? <LoadingOverlay /> : children}
    </DataListOptionContext.Provider>
  );
}
