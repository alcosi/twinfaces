export type ExtendedFeaturerParam = {
  key: string;
  type: string;
  value: string;
};

export function extendFeaturerParams(
  params?: Record<string, string>,
  featurerParams?: Array<{ key?: string; type?: string }>
): ExtendedFeaturerParam[] {
  if (!params || !featurerParams) {
    return [];
  }

  return Object.entries(params).map(([paramKey, paramValue]) => {
    const paramDefinition = featurerParams.find((p) => p.key === paramKey);

    return {
      key: paramKey,
      type: paramDefinition?.type || "UNKNOWN",
      value: paramValue,
    };
  });
}

export function getFeaturerLink(type: string, value: string): string | null {
  const config = featurerLinkList.find((item) => item.type === type);
  if (!config) return null;
  return `${config.pathPattern}${value}`;
}

export type FeaturerLinkConfig = {
  type: string;
  pathPattern: string;
};

export const featurerLinkList: FeaturerLinkConfig[] = [
  {
    type: "UUID:TWINS:TWIN_CLASS_ID",
    pathPattern: "/core/twinclass/",
  },
  {
    type: "UUID:TWINS:TWIN_CLASS_FIELD_ID",
    pathPattern: "/core/fields/",
  },
];
