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
  useFetchTwinStatusById,
  useTwinStatusSearchV1,
} from "../../api";

export function useTwinStatusSelectAdapter(
  twinClassId?: string
): SelectAdapter<TwinStatusV2> {
  const { theme } = useTheme();
  const { fetchTwinStatusById } = useFetchTwinStatusById();
  const { searchTwinStatuses } = useTwinStatusSearchV1();

  async function getById(id: string) {
    return fetchTwinStatusById(id);
  }

  async function getItems(search: string) {
    try {
      const filters: TwinStatusFilters = {
        twinClassIdList: twinClassId ? [twinClassId] : [],
        keyLikeList: search ? [wrapWithPercent(search)] : [],
      };
      const { data } = await searchTwinStatuses({ filters });
      return data;
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
          <Square className="w-4 h-4" fill={squareColor} stroke={squareColor} />
        </div>
        <span className="truncate">
          {isPopulatedString(status.name) ? status.name : status.key}
        </span>
      </div>
    );
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
