import { usePathname } from "next/navigation";

import { REGEX_PATTERNS } from "../constants";
import { isPopulatedArray } from "../types";
import { shortenUUID } from "../utils";

type Breadcrumb = {
  label: string;
  href: string;
};

export function useRouteCrumbs(): Breadcrumb[] {
  const path = usePathname();
  const segments =
    path.match(new RegExp(REGEX_PATTERNS.PATH_SEGMENTS, "g")) ?? [];

  return segments.reduce<Breadcrumb[]>((crumbs, segment) => {
    const prevHref = isPopulatedArray(crumbs)
      ? crumbs[crumbs.length - 1]!.href
      : "";
    const href = `${prevHref}/${segment}`;

    const isUUID = REGEX_PATTERNS.UUID.test(segment);
    const label = isUUID ? `ID: ${shortenUUID(segment)}` : segment;

    crumbs.push({ label, href });
    return crumbs;
  }, []);
}
