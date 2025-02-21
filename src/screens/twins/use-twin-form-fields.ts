import { useDatalistOptionSelectAdapter } from "@/entities/datalist-option";
import { TwinFormValues, useTwinHeadSelectAdapter } from "@/entities/twin";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { useUserSelectAdapter } from "@/entities/user";
import { isArray, isPopulatedArray } from "@/shared/libs";
import { Control, useWatch } from "react-hook-form";

export function useTwinClassFields(control: Control<TwinFormValues>) {
  const twinClassAdapter = useTwinClassSelectAdapter();
  const userAdapter = useUserSelectAdapter();
  const headAdapter = useTwinHeadSelectAdapter();
  const optionAdapter = useDatalistOptionSelectAdapter();

  const watchedClassId = useWatch({ control, name: "classId" });
  const twinClasses = isArray(watchedClassId)
    ? (watchedClassId as TwinClass_DETAILED[])
    : [];
  const selectedTwinClass = isPopulatedArray<TwinClass_DETAILED>(twinClasses)
    ? twinClasses[0]
    : null;

  return {
    selectedTwinClass,
    twinClassAdapter: {
      ...twinClassAdapter,
      getItems: (search: string) => {
        return twinClassAdapter.getItems(search, { abstractt: "ONLY_NOT" });
      },
    },
    fields: selectedTwinClass?.fields ?? [],
    userAdapter,
    hasHeadClass: Boolean(selectedTwinClass?.headClass),
    headAdapter: {
      ...headAdapter,
      getItems: (search: string) =>
        headAdapter.getItems(selectedTwinClass?.id || "", search, {
          twinClassId: selectedTwinClass?.id,
        }),
    },
    hasTagDataList: Boolean(selectedTwinClass?.tagsDataListId),
    optionAdapter: {
      ...optionAdapter,
      getItems: (search: string) =>
        selectedTwinClass?.tagsDataListId
          ? optionAdapter.getItems(selectedTwinClass.id, search, {
              dataListIdList: [selectedTwinClass.tagsDataListId],
            })
          : Promise.resolve([]),
    },
  };
}
