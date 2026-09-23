"use client";

import Link from "next/link";

import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { DatalistResourceLink } from "@/features/datalist/ui";
import { FeaturerParamValue } from "@/features/featurer/utils/helpers";
import { LinkResourceLink } from "@/features/link/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserGroupResourceLink } from "@/features/user-group/ui";
import { UserResourceLink } from "@/features/user/ui";

type Props = {
  value: FeaturerParamValue;
  /** Where a value the response did not decode still links to, if anywhere. */
  href?: string;
};

/**
 * One value of a featurer parameter, drawn as the entity it points at.
 *
 * Lives here rather than in the featurer feature because it is composed of other
 * features' resource links, which a feature may not reach for. Tooltips are
 * deliberately left off: these are already shown inside the featurer's own hover
 * card, and a hover card of their own would open on top of it.
 */
export function FeaturerParamValueLink({ value, href }: Props) {
  switch (value.kind) {
    case "twinClass":
      return <TwinClassResourceLink data={value.entity} />;
    case "twinClassField":
      return <TwinClassFieldResourceLink data={value.entity} />;
    case "twin":
      return <TwinResourceLink data={value.entity} />;
    case "status":
      return <TwinClassStatusResourceLink data={value.entity} />;
    case "datalist":
      return <DatalistResourceLink data={value.entity} />;
    case "datalistOption":
      return <DatalistOptionResourceLink data={value.entity} />;
    case "link":
      return <LinkResourceLink data={value.entity} />;
    case "user":
      return <UserResourceLink data={value.entity} />;
    case "userGroup":
      return <UserGroupResourceLink data={value.entity} />;
    case "permission":
      return <PermissionResourceLink data={value.entity} />;
    case "raw":
      // Nothing came back for this id: the uuid itself, exactly as before.
      return href ? (
        <Link
          href={href}
          className="text-link-enabled hover:underline"
          rel="noopener noreferrer"
        >
          {value.id}
        </Link>
      ) : (
        <span className="break-all">{value.id}</span>
      );
  }
}
