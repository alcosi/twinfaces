import {
  isPopulatedString,
  SelectAdapter,
  wrapWithPercent,
} from "@/shared/libs";
import { Square } from "lucide-react";
import { useTheme } from "next-themes";
import {
  TwinStatus,
  TwinStatusFilters,
  useFetchTwinStatusById,
  useTwinStatusSearchV1,
} from "../../api";

export function useTwinStatusSelectAdapter(
  twinClassId?: string
): SelectAdapter<TwinStatus> {
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

  function renderItem(status: TwinStatus) {
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
