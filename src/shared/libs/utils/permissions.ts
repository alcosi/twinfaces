const CORE_ROUTE_PERMISSION_PREFIX_MAP: Record<string, string[]> = {
  //? NOTE Class menu
  twinclass: ["TWIN_CLASS"],
  fields: ["TWIN_CLASS_FIELD"],
  statuses: ["TWIN_STATUS"],
  links: ["LINK"],
  "dynamic-markers": ["TWIN_CLASS_DYNAMIC_MARKER"],
  "space-roles": ["SPACE_ROLE"],

  //? NOTE Twin menu
  twins: ["TWIN"],
  comments: ["COMMENT"],
  attachments: ["ATTACHMENT"],

  //? NOTE User menu
  users: ["USER"],
  "user-groups": ["USER_GROUP"],

  //? NOTE Datalist menu
  datalists: ["DATA_LIST"],
  "datalist-options": ["DATA_LIST_OPTION"],
  "option-projections": ["DATA_LIST_OPTION"],
  subsets: ["DATA_LIST_SUBSET"],

  //? NOTE Permission menu
  permissions: ["PERMISSION"],
  "permission-groups": ["PERMISSION_GROUP"],
  "permission-schemas": ["PERMISSION_SCHEMA"],

  //? NOTE Factory menu
  factories: ["FACTORY"],
  multipliers: ["FACTORY_MULTIPLIER"],
  "multiplier-filters": ["FACTORY_MULTIPLIER"],
  pipelines: ["FACTORY_PIPELINE"],
  "pipeline-steps": ["FACTORY_PIPELINE_STEP"],
  branches: ["FACTORY_BRANCH"],
  erasers: ["FACTORY_ERASER"],
  conditions: ["FACTORY_CONDITION_SET"],
  "condition-sets": ["FACTORY_CONDITION_SET"],

  //? NOTE Transition menu
  transitions: ["TRANSITION"],
  twinflows: ["TWINFLOW"],
  "twinflow-schemas": ["TWINFLOW_SCHEMA"],
  "twinflow-factories": ["TWINFLOW_FACTORY"],

  //? NOTE Business account menu
  "business-accounts": ["DOMAIN_BUSINESS_ACCOUNT"],
  tiers: ["TIER"],

  //? NOTE Misc menu
  featurers: ["FEATURER"],

  //? NOTE Projection menu
  projections: ["PROJECTION"],

  //? NOTE Notification menu
  recipients: ["HISTORY_NOTIFICATION"],
  "recipient-collectors": ["HISTORY_NOTIFICATION"],
  notifications: ["HISTORY_NOTIFICATION"],

  //? NOTE Validator menu
  "validator-sets": ["TWIN_VALIDATOR_SET"],

  //? NOTE Triggers menu
  "twin-triggers": ["TWIN_TRIGGER"],
  "transition-triggers": ["TWIN_TRIGGER"],
  "status-triggers": ["TWIN_TRIGGER"],
  "factory-triggers": ["TWIN_TRIGGER"],

  //? OTHERS
};

export type PermissionAction = "MANAGE" | "CREATE" | "UPDATE" | "DELETE";

export function getCoreRouteSegment(pathname: string): string | undefined {
  if (!pathname.startsWith("/core")) return undefined;
  const [, , segment] = pathname.split("/");
  return segment || undefined;
}

export function getPermissionPrefixesByCoreRoute(segment?: string): string[] {
  if (!segment) return [];

  const mapped = CORE_ROUTE_PERMISSION_PREFIX_MAP[segment];
  if (mapped) return mapped;

  const normalized = segment.replace(/-/g, "_").replace(/s$/, "").toUpperCase();

  return normalized ? [normalized] : [];
}

export function getPermissionKeysForCoreRouteAction({
  pathname,
  action,
}: {
  pathname: string;
  action: PermissionAction;
}): string[] {
  const segment = getCoreRouteSegment(pathname);
  const prefixes = getPermissionPrefixesByCoreRoute(segment);
  return prefixes.map((prefix) => `${prefix}_${action}`);
}

export function hasAnyPermissionKey({
  permissionKeys,
  keysToCheck,
}: {
  permissionKeys: Iterable<string>;
  keysToCheck: string[];
}): boolean {
  const set =
    permissionKeys instanceof Set ? permissionKeys : new Set(permissionKeys);
  return keysToCheck.some((key) => set.has(key));
}
