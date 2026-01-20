export type ExtendedFeaturerParam = {
  key: string;
  type: string;
  value: string;
};

export type FeaturerLink = {
  id: string;
  href: string;
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
      type: paramDefinition?.type || "N/A",
      value: paramValue,
    };
  });
}

function parseIds(value: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

export function getFeaturerLinks(type: string, value: string): FeaturerLink[] {
  const config = featurerLinkList.find((item) => item.type === type);
  if (!config) return [];
  const ids = parseIds(value);
  return ids.map((id) => ({
    id,
    href: `${config.pathPattern}${id}`,
  }));
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
    type: "UUID_SET:TWINS:TWIN_CLASS_ID",
    pathPattern: "/core/twinclass/",
  },
  {
    type: "UUID:TWINS:TWIN_CLASS_FIELD_ID",
    pathPattern: "/core/fields/",
  },
  {
    type: "UUID_SET:TWINS:TWIN_CLASS_FIELD_ID",
    pathPattern: "/core/fields/",
  },
  // {
  //   type: "UUID:TWINS:TWIN_CLASS_FIELD_SEARCH_ID",
  //   pathPattern: "/core/",
  // },
  {
    type: "UUID:TWINS:TWIN_ID",
    pathPattern: "/core/twins/",
  },
  {
    type: "UUID:TWINS:TWIN_STATUS_ID",
    pathPattern: "/core/statuses/",
  },
  {
    type: "UUID_SET:TWINS:TWIN_STATUS_ID",
    pathPattern: "/core/statuses/",
  },
  {
    type: "UUID:TWINS:DATA_LIST_ID",
    pathPattern: "/core/datalists/",
  },
  // {
  //   type: "UUID:TWINS:I18N_ID",
  //   pathPattern: "/core/",
  // },
  {
    type: "UUID:TWINS:LINK_ID",
    pathPattern: "/core/links/",
  },
  {
    type: "UUID_SET:TWINS:LINK_ID",
    pathPattern: "/core/links/",
  },
  // {
  //   type: "UUID:TWINS:MARKER_ID",
  //   pathPattern: "/core/",
  // },
  // {
  //   type: "UUID:TWINS:PERMISSION_ID",
  //   pathPattern: "/core/",
  // },
  // {
  //   type: "UUID:TWINS:RESTRICTION_ID",
  //   pathPattern: "/core/",
  // },

  {
    type: "UUID_SET:TWINS:DATALIST_OPTION_ID",
    pathPattern: "/core/datalist-options/",
  },
  {
    type: "UUID_SET:TWINS:USER_ID",
    pathPattern: "/core/users/",
  },
  {
    type: "UUID_SET:TWINS:USER_GROUP_ID",
    pathPattern: "/core/user-groups/",
  },
  // {
  //   type: "UUID_SET:TWINS:DATALIST_SUBSET_ID",
  //   pathPattern: "/core/",
  // },
  // {
  //   type: "UUID_SET:TWINS:PROJECTION_TYPE_GROUP_ID",
  //   pathPattern: "/core/",
  // },
  // {
  //   type: "UUID_SET:TWINS:TWIN_CLASS_FREEZE_ID",
  //   pathPattern: "/core/",
  // },
];
