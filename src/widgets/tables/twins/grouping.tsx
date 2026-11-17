import { TWIN_SELF_FIELD_KEY_TO_ID_MAP, TwinCountGroup } from "@/entities/twin";
import { TwinFilters } from "@/entities/twin/server";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";

import { CountGroupField, narrowBy } from "../../crud-data-table";

/**
 * Static twin fields the count endpoint groups by. Dynamic-field groups come
 * back as `groupedFieldValues` and are not wired up yet.
 */
export const TWIN_GROUP_FIELDS: CountGroupField<TwinCountGroup, TwinFilters>[] =
  [
    {
      key: "status",
      label: "Status",
      groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.statusId,
      getValue: (g) => g.twinStatusId,
      getText: (g) => g.status?.name,
      renderLabel: (g) =>
        g.status && <TwinClassStatusResourceLink data={g.status} withTooltip />,
      narrow: narrowBy.idList<TwinFilters>("statusIdList"),
    },
    {
      key: "twinClass",
      label: "Twin class",
      groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.twinClassId,
      getValue: (g) => g.twinClassId,
      getText: (g) => g.twinClass?.name,
      renderLabel: (g) =>
        g.twinClass && <TwinClassResourceLink data={g.twinClass} withTooltip />,
      narrow: narrowBy.idList<TwinFilters>("twinClassIdList"),
    },
    {
      key: "assignee",
      label: "Assignee",
      groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.assignerUserId,
      getValue: (g) => g.assignerUserId,
      getText: (g) => g.assignerUser?.fullName,
      renderLabel: (g) =>
        g.assignerUser && (
          <UserResourceLink data={g.assignerUser} withTooltip />
        ),
      narrow: narrowBy.idList<TwinFilters>("assignerUserIdList"),
    },
    {
      key: "author",
      label: "Author",
      groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.authorUserId,
      getValue: (g) => g.createdByUserId,
      getText: (g) => g.createdByUser?.fullName,
      renderLabel: (g) =>
        g.createdByUser && (
          <UserResourceLink data={g.createdByUser} withTooltip />
        ),
      narrow: narrowBy.idList<TwinFilters>("createdByUserIdList"),
    },
    {
      key: "head",
      label: "Head",
      groupField: TWIN_SELF_FIELD_KEY_TO_ID_MAP.headTwinId,
      getValue: (g) => g.headTwinId,
      getText: (g) => g.headTwin?.name,
      renderLabel: (g) =>
        g.headTwin && <TwinResourceLink data={g.headTwin} withTooltip />,
      narrow: narrowBy.idList<TwinFilters>("headTwinIdList"),
    },
  ];
