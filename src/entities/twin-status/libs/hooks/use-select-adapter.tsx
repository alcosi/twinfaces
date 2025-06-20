import { Square } from "lucide-react";
import { useTheme } from "next-themes";

import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  TwinStatusFilters,
  TwinStatusV2,
  filterDuplicateStatuses,
  useFetchTwinStatusById,
  useTwinStatusSearchV1,
} from "../../api";

export function useTwinStatusSelectAdapter(): SelectAdapter<TwinStatusV2> {
  const { theme } = useTheme();
  const { fetchTwinStatusById } = useFetchTwinStatusById();
  const { searchTwinStatuses } = useTwinStatusSearchV1();

  async function getById(id: string) {
    return fetchTwinStatusById(id);
  }

  async function getItems(search: string, filters?: TwinStatusFilters) {
    try {
      const response = await searchTwinStatuses({
        filters: {
          keyLikeList: search ? [wrapWithPercent(search)] : [],
          ...filters,
        },
      });
      return filterDuplicateStatuses(response.data);
    } catch (error) {
      console.error("Error fetching search items:", error);
      return [];
    }
  }

  function renderItem(status: TwinStatusV2) {
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
    getById,
    getItems: (search, options) =>
      getItems(search, options as TwinStatusFilters),
    renderItem,
  };
}
