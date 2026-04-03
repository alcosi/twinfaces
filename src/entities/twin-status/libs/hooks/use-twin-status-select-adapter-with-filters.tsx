import { Square } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  TwinStatus,
  TwinStatusFilters,
  useFetchTwinStatusById,
  useTwinStatusSearchV1,
} from "../../api";

export function useTwinStatusSelectAdapterWithFilters(): SelectAdapterWithFilters<
  TwinStatus,
  TwinStatusFilters
> {
  const { theme } = useTheme();
  const { fetchTwinStatusById } = useFetchTwinStatusById();
  const { searchTwinStatuses } = useTwinStatusSearchV1();

  const filtersRef = useRef<TwinStatusFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: TwinStatusFilters) {
    filtersRef.current = filters;
  }

  const invalidate = () => {
    setVersion((v) => v + 1);
  };

  async function getItems(search: string) {
    try {
      const keyLikeList = [
        ...(search ? [wrapWithPercent(search)] : []),
        ...(filtersRef.current.keyLikeList ?? []),
      ];

      const response = await searchTwinStatuses({
        filters: {
          ...filtersRef.current,
          keyLikeList,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching search items:", error);
      return [];
    }
  }

  function renderItem(status: TwinStatus) {
    const squareColor =
      status.backgroundColor || (theme === "light" ? "#0c66e4" : "#579dff");

    return (
      <div className="flex gap-2">
        <div className="flex grow">
          <Square className="h-4 w-4" fill={squareColor} stroke={squareColor} />
        </div>
        <span className="truncate">
          {isPopulatedString(status.name) ? status.name : status.key}
        </span>
      </div>
    );
  }

  return {
    getById: fetchTwinStatusById,
    getItems,
    renderItem,
    setFilters,
    invalidate,
    version,
  };
}
