import { useDatalistOptionSelectAdapter } from "@/entities/datalist-option";
import { TwinFormValues, useTwinHeadSelectAdapter } from "@/entities/twin";
import { TwinClass_DETAILED } from "@/entities/twinClass";
import { useUserSelectAdapter } from "@/entities/user/libs";
import { isArray, isPopulatedArray } from "@/shared/libs";
import { Control, useWatch } from "react-hook-form";

export function useTwinClassFields(control: Control<TwinFormValues>) {
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
    fields: selectedTwinClass?.fields ?? [],
    userAdapter,
    hasHeadClass: Boolean(selectedTwinClass?.headClass),
    headAdapter: {
      ...headAdapter,
      getItems: (search: string) =>
        headAdapter.getItems(search, { twinClassId: selectedTwinClass?.id }),
    },
    hasTagDataList: Boolean(selectedTwinClass?.tagsDataListId),
    optionAdapter: {
      ...optionAdapter,
      getItems: (search: string) =>
        selectedTwinClass?.tagsDataListId
          ? optionAdapter.getItems(search, {
              dataListIdList: [selectedTwinClass.tagsDataListId],
            })
          : Promise.resolve([]),
    },
  };
}
