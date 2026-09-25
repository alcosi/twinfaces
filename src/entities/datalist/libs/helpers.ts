import { z } from "zod";

import { DataListCreateRqV1 } from "../api";
import { DATALIST_SCHEMA } from "./constans";

/**
 * Shared by the datalists table and the cascading create panel, so both post
 * the very same body.
 */
export function buildDatalistCreateRq(
  values: z.infer<typeof DATALIST_SCHEMA>
): DataListCreateRqV1 {
  const { key, name, description, ...rest } = values;

  return {
    ...rest,
    key,
    nameI18n: { translationInCurrentLocale: name, translations: {} },
    descriptionI18n: description
      ? { translationInCurrentLocale: description, translations: {} }
      : undefined,
  };
}
