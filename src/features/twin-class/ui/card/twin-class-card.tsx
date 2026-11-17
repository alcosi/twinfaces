"use client";

import { useTheme } from "next-themes";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { formatIntlDate, isPopulatedString } from "@/shared/libs";
import { Avatar } from "@/shared/ui";
import {
  EntityCardField,
  EntityCardFields,
  EntityCardHeaderProps,
  EntityCardSection,
  EntityCardSectionRegistry,
} from "@/shared/ui/entity-card";

import { TwinClassIcon } from "../twin-class-icon";

/** The class's own icon for the current theme, falling back to the generic one. */
export function TwinClassCardIcon({
  twinClass,
}: {
  twinClass: TwinClass_DETAILED;
}) {
  const { resolvedTheme } = useTheme();

  const themeIcon =
    resolvedTheme === "light"
      ? twinClass.iconLight
      : resolvedTheme === "dark"
        ? twinClass.iconDark
        : undefined;

  return isPopulatedString(themeIcon) ? (
    <Avatar url={themeIcon} alt={twinClass.name ?? "Logo"} size="xlg" />
  ) : (
    <TwinClassIcon />
  );
}

export function getTwinClassTitle(twinClass: TwinClass_DETAILED): string {
  return twinClass.name || twinClass.key || twinClass.id;
}

/** The header every twin class card starts with: icon, name, key. */
export function getTwinClassCardHeader(
  twinClass: TwinClass_DETAILED
): Pick<EntityCardHeaderProps, "title" | "subtitle" | "icon"> {
  const title = getTwinClassTitle(twinClass);

  return {
    title,
    subtitle: twinClass.key !== title ? twinClass.key : undefined,
    icon: <TwinClassCardIcon twinClass={twinClass} />,
  };
}

/**
 * Every section a twin class card can carry out of the class alone. A place
 * that has more to show — the graph, with the class's fields and statuses
 * resolved into links — spreads this registry into its own and adds them.
 */
export const twinClassCardSections: EntityCardSectionRegistry<TwinClass_DETAILED> =
  {
    summary: (twinClass) =>
      twinClass.description || twinClass.createdAt ? (
        <EntityCardSection className="space-y-1">
          {twinClass.description && (
            <p className="text-foreground text-xs break-words">
              {twinClass.description}
            </p>
          )}
          {twinClass.createdAt && (
            <EntityCardFields>
              <EntityCardField label="Created at" labelWidth={88}>
                {formatIntlDate(twinClass.createdAt, "datetime-local")}
              </EntityCardField>
            </EntityCardFields>
          )}
        </EntityCardSection>
      ) : null,
  };

/**
 * Which sections each place shows. `fields` and `statuses` are not in the
 * registry above: they are resource links of other features, so the graph —
 * which may reach for those — supplies them itself.
 */
export const TWIN_CLASS_CARD_PRESETS = {
  tooltip: ["summary"],
  graph: ["fields", "statuses"],
} as const;
