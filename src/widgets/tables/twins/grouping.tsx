import { ReactNode } from "react";

import { TWIN_SELF_FIELD_KEY_TO_ID_MAP, TwinCountGroup } from "@/entities/twin";
import { TwinFilters } from "@/entities/twin/server";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { NULLIFY_UUID_VALUE } from "@/shared/libs";

import { GroupPathStep } from "../../crud-data-table";

type TwinGroupFilterKey = keyof Pick<
  TwinFilters,
  | "statusIdList"
  | "twinClassIdList"
  | "assignerUserIdList"
  | "createdByUserIdList"
  | "headTwinIdList"
>;

/**
 * A static twin field the count endpoint can group by, and how a group of it
 * is narrowed down to — and labelled — on the client.
 */
export type TwinGroupDefinition = {
  key: string;
  label: string;
  /** TwinClassFieldId the count endpoint groups by. */
  groupFieldId: string;
  /** The search filter that keeps only the twins of one group. */
  filterKey: TwinGroupFilterKey;
  getValue: (group: TwinCountGroup) => string | undefined;
  getText: (group: TwinCountGroup) => string | undefined;
  renderLabel: (group: TwinCountGroup) => ReactNode;
};

export const TWIN_NO_VALUE_GROUP_LABEL = "— Not set —";

/**
 * Static fields only: dynamic-field groups come back as `groupedFieldValues`
 * and are not wired up yet.
 */
export const TWIN_GROUP_DEFINITIONS: TwinGroupDefinition[] = [
  {
    key: "status",
    label: "Status",
    groupFieldId: TWIN_SELF_FIELD_KEY_TO_ID_MAP.statusId,
    filterKey: "statusIdList",
    getValue: (g) => g.twinStatusId,
    getText: (g) => g.status?.name,
    renderLabel: (g) =>
      g.status && <TwinClassStatusResourceLink data={g.status} withTooltip />,
  },
  {
    key: "twinClass",
    label: "Twin class",
    groupFieldId: TWIN_SELF_FIELD_KEY_TO_ID_MAP.twinClassId,
    filterKey: "twinClassIdList",
    getValue: (g) => g.twinClassId,
    getText: (g) => g.twinClass?.name,
    renderLabel: (g) =>
      g.twinClass && <TwinClassResourceLink data={g.twinClass} withTooltip />,
  },
  {
    key: "assignee",
    label: "Assignee",
    groupFieldId: TWIN_SELF_FIELD_KEY_TO_ID_MAP.assignerUserId,
    filterKey: "assignerUserIdList",
    getValue: (g) => g.assignerUserId,
    getText: (g) => g.assignerUser?.fullName,
    renderLabel: (g) =>
      g.assignerUser && <UserResourceLink data={g.assignerUser} withTooltip />,
  },
  {
    key: "author",
    label: "Author",
    groupFieldId: TWIN_SELF_FIELD_KEY_TO_ID_MAP.authorUserId,
    filterKey: "createdByUserIdList",
    getValue: (g) => g.createdByUserId,
    getText: (g) => g.createdByUser?.fullName,
    renderLabel: (g) =>
      g.createdByUser && (
        <UserResourceLink data={g.createdByUser} withTooltip />
      ),
  },
  {
    key: "head",
    label: "Head",
    groupFieldId: TWIN_SELF_FIELD_KEY_TO_ID_MAP.headTwinId,
    filterKey: "headTwinIdList",
    getValue: (g) => g.headTwinId,
    getText: (g) => g.headTwin?.name,
    renderLabel: (g) =>
      g.headTwin && <TwinResourceLink data={g.headTwin} withTooltip />,
  },
];

export function findTwinGroupDefinition(key: string) {
  const definition = TWIN_GROUP_DEFINITIONS.find((d) => d.key === key);
  if (!definition) throw new Error(`Unknown twin group field: ${key}`);
  return definition;
}

/**
 * Narrows a twin search down to one group per level of `path`. A group's value
 * replaces whatever the filter held: the group was counted under that filter,
 * so it already lies inside it. The group of twins with no value is reached
 * with the API's nullify marker, which matches an empty field.
 */
export function narrowTwinFiltersToGroup(
  filters: TwinFilters,
  path: GroupPathStep[]
): TwinFilters {
  return path.reduce<TwinFilters>(
    (acc, step) => ({
      ...acc,
      [findTwinGroupDefinition(step.fieldKey).filterKey]: [
        step.value ?? NULLIFY_UUID_VALUE,
      ],
    }),
    { ...filters }
  );
}
