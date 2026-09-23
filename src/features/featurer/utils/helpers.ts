import type { DataList } from "@/entities/datalist";
import type { DataListOptionV1 } from "@/entities/datalist-option";
import type { Link } from "@/entities/link";
import type { Permission } from "@/entities/permission";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import type { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import type { TwinStatus } from "@/entities/twin-status";
import type { Twin } from "@/entities/twin/server";
import type { User } from "@/entities/user";
import type { UserGroup } from "@/entities/user-group";
import type { RelatedObjects } from "@/shared/api";

export type ExtendedFeaturerParam = {
  key: string;
  type: string;
  value: string;
  /**
   * The value read as what it actually points at. Empty for a parameter that is
   * not a reference at all (a number, a flag, a plain string) — those are shown
   * as they came.
   */
  values?: FeaturerParamValue[];
};

/**
 * One value of a featurer parameter, resolved against the related objects the
 * response delivered alongside it.
 *
 * Parameters are stored as bare uuids, so until the backend started decoding
 * them there was nothing to show but the uuid itself. `raw` is what is left when
 * a reference was not decoded — the id, linked the way it always was.
 */
export type FeaturerParamValue =
  | { kind: "twinClass"; id: string; entity: TwinClass_DETAILED }
  | { kind: "twinClassField"; id: string; entity: TwinClassField_DETAILED }
  | { kind: "twin"; id: string; entity: Twin }
  | { kind: "status"; id: string; entity: TwinStatus }
  | { kind: "datalist"; id: string; entity: DataList }
  | { kind: "datalistOption"; id: string; entity: DataListOptionV1 }
  | { kind: "link"; id: string; entity: Link }
  | { kind: "user"; id: string; entity: User }
  | { kind: "userGroup"; id: string; entity: UserGroup }
  | { kind: "permission"; id: string; entity: Permission }
  | { kind: "raw"; id: string };

export type FeaturerLink = {
  id: string;
  href: string;
};

export function extendFeaturerParams(
  params?: Record<string, string>,
  featurerParams?: Array<{ key?: string; type?: string }>,
  relatedObjects?: RelatedObjects
): ExtendedFeaturerParam[] {
  if (!params || !featurerParams) {
    return [];
  }

  return Object.entries(params).map(([paramKey, paramValue]) => {
    const paramDefinition = featurerParams.find((p) => p.key === paramKey);
    const type = paramDefinition?.type || "N/A";

    return {
      key: paramKey,
      type,
      value: paramValue,
      values: resolveFeaturerParamValues(type, paramValue, relatedObjects),
    };
  });
}

/**
 * Reads a parameter as the entities it refers to. A set type holds several ids
 * in one comma-separated value, so this returns a list either way.
 */
export function resolveFeaturerParamValues(
  type: string,
  value: string,
  relatedObjects?: RelatedObjects
): FeaturerParamValue[] | undefined {
  // The last segment of "UUID_SET:TWINS:TWIN_CLASS_FIELD_ID" is what the value
  // points at; the rest says only whether it is one id or several.
  const target = type.split(":").pop();
  if (!target || !REFERENCE_TARGETS.has(target)) return undefined;

  return parseIds(value).map((id) =>
    resolveParamValue(target, id, relatedObjects)
  );
}

/** Parameter targets this build can turn into a link to the entity itself. */
const REFERENCE_TARGETS = new Set([
  "TWIN_CLASS_ID",
  "TWIN_CLASS_FIELD_ID",
  "TWIN_ID",
  "TWIN_STATUS_ID",
  "DATA_LIST_ID",
  "DATALIST_OPTION_ID",
  "LINK_ID",
  "USER_ID",
  "USER_GROUP_ID",
  "PERMISSION_ID",
]);

function resolveParamValue(
  target: string,
  id: string,
  relatedObjects?: RelatedObjects
): FeaturerParamValue {
  const raw: FeaturerParamValue = { kind: "raw", id };
  if (!relatedObjects) return raw;

  // Cast rather than hydrate: the maps carry the entity as the response sent it,
  // and every hydrator in the app widens the same way — what the links read here
  // is the name, which is right there on the DTO.
  switch (target) {
    case "TWIN_CLASS_ID": {
      const entity = relatedObjects.twinClassMap?.[id] as
        | TwinClass_DETAILED
        | undefined;
      return entity ? { kind: "twinClass", id, entity } : raw;
    }
    case "TWIN_CLASS_FIELD_ID": {
      const entity = relatedObjects.twinClassFieldMap?.[id] as
        | TwinClassField_DETAILED
        | undefined;
      return entity ? { kind: "twinClassField", id, entity } : raw;
    }
    case "TWIN_ID": {
      const entity = relatedObjects.twinMap?.[id] as Twin | undefined;
      return entity ? { kind: "twin", id, entity } : raw;
    }
    case "TWIN_STATUS_ID": {
      const entity = relatedObjects.statusMap?.[id];
      return entity ? { kind: "status", id, entity } : raw;
    }
    case "DATA_LIST_ID": {
      const entity = relatedObjects.dataListsMap?.[id];
      return entity ? { kind: "datalist", id, entity } : raw;
    }
    case "DATALIST_OPTION_ID": {
      const entity = relatedObjects.dataListsOptionMap?.[id];
      return entity ? { kind: "datalistOption", id, entity } : raw;
    }
    case "LINK_ID": {
      const entity = relatedObjects.linkMap?.[id] as Link | undefined;
      return entity ? { kind: "link", id, entity } : raw;
    }
    case "USER_ID": {
      const entity = relatedObjects.userMap?.[id];
      return entity ? { kind: "user", id, entity } : raw;
    }
    case "USER_GROUP_ID": {
      const entity = relatedObjects.userGroupMap?.[id];
      return entity ? { kind: "userGroup", id, entity } : raw;
    }
    case "PERMISSION_ID": {
      const entity = relatedObjects.permissionMap?.[id];
      return entity ? { kind: "permission", id, entity } : raw;
    }
    default:
      return raw;
  }
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
