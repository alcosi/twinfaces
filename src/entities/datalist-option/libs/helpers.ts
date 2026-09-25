// NOTE: importing from '@/entities/datalist' triggers an exception
import { z } from "zod";

import { DataList } from "@/entities/datalist/api/types";
import { RelatedObjects } from "@/shared/api";
import { isPopulatedArray, isPopulatedString } from "@/shared/libs";

import {
  DataListOptionCreateRqDV1,
  DataListOptionV1,
  DataListOption_DETAILED,
} from "../api";
import { DATALIST_OPTION_SCHEMA } from "./constans";

export function hydrateDatalistOptionFromMap(
  dto: DataListOptionV1,
  relatedObjects?: RelatedObjects
): DataListOption_DETAILED {
  const hydrate: DataListOption_DETAILED = Object.assign(
    {},
    dto
  ) as DataListOption_DETAILED;

  if (dto.dataListId && relatedObjects?.dataListsMap) {
    hydrate.dataList = relatedObjects.dataListsMap[dto.dataListId]!;
  }

  return hydrate;
}

/**
 * Shared by the datalist-options table and the cascading create panel, so both
 * post the very same body. The attribute inputs are keyed by position in the
 * form and by the datalist's own attribute keys on the wire.
 */
export function buildDatalistOptionCreateRq(
  values: z.infer<typeof DATALIST_OPTION_SCHEMA>
): DataListOptionCreateRqDV1 {
  const datalist = (
    isPopulatedArray(values.dataList) ? values.dataList[0] : values.dataList
  ) as DataList;

  const attributesMap = [
    { key: datalist.attribute1?.key, value: values.attribute1 },
    { key: datalist.attribute2?.key, value: values.attribute2 },
    { key: datalist.attribute3?.key, value: values.attribute3 },
    { key: datalist.attribute4?.key, value: values.attribute4 },
  ].reduce(
    (acc, { key, value }) => {
      if (isPopulatedString(key)) {
        acc[key] = value!;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  return {
    dataListId: datalist.id,
    optionI18n: {
      translationInCurrentLocale: values.name,
      translations: {},
    },
    icon: values.icon,
    attributesMap,
  };
}
