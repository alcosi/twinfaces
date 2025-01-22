import {
  createFixedSelectAdapter,
  isPopulatedArray,
  isPopulatedString,
  SelectAdapter,
  shortenUUID,
} from "@/shared/libs";
import { Twin_DETAILED } from "../../api";
import { useTwinFetchByIdV2, useTwinSearchV3 } from "../../api/hooks";
import { TwinBasicFields, TwinTouchIds } from "../constants";

export function useTwinSelectAdapter(): SelectAdapter<Twin_DETAILED> {
  const { searchTwins } = useTwinSearchV3();
  const { fetchTwinById } = useTwinFetchByIdV2();

  async function getById(id: string) {
    const data = await fetchTwinById(id);
    return data as Twin_DETAILED;
  }

  async function getItems(search: string) {
    const response = await searchTwins({ search });
    return response.data as Twin_DETAILED[];
  }

  function renderItem({ aliases, name, id }: Twin_DETAILED) {
    const twinName = isPopulatedString(name) ? name : shortenUUID(id);

    if (isPopulatedArray(aliases)) {
      return `${aliases?.slice(-1)} : ${twinName}`;
    }

    return twinName;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}

export function useTwinBasicFieldSelectAdapter(): SelectAdapter<
  (typeof TwinBasicFields)[number]
> {
  return createFixedSelectAdapter(TwinBasicFields);
}

export function useTwinTouchIdSelectAdapter(): SelectAdapter<
  (typeof TwinTouchIds)[number]
> {
  return createFixedSelectAdapter(TwinTouchIds);
}
