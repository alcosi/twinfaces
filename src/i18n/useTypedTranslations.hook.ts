import { useTranslations } from "next-intl";

import type { TranslationKey } from "./i18n.js";

type TypedTFunction = (key: TranslationKey, ...args: any[]) => string;

export const useTypedTranslations = (): TypedTFunction => {
  const t = useTranslations();

  return ((key: TranslationKey, ...args: any[]) => {
    return t(key, ...args);
  }) as TypedTFunction;
};
